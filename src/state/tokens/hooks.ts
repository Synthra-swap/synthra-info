import { AppState, AppDispatch } from './../index'
import { TokenData, TokenChartEntry } from './reducer'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateTokenData,
  addTokenKeys,
  addPoolAddresses,
  updateChartData,
  updatePriceData,
  updateTransactions,
} from './actions'
import { isAddress } from 'ethers'
import { fetchPoolsForToken } from 'data/tokens/poolsForToken'
import { fetchTokenChartData } from 'data/tokens/chartData'
import { fetchTokenPriceData } from 'data/tokens/priceData'
import { fetchTokenTransactions } from 'data/tokens/transactions'
import { PriceChartEntry, Transaction } from 'types'
import { notEmpty } from 'utils'
import dayjs, { OpUnitType } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useActiveNetworkVersion, useClients } from 'state/application/hooks'
import { POOL_ALLOW_LIST, TOKEN_ALLOW_LIST } from '../../constants/index'
// format dayjs with the libraries that we need
dayjs.extend(utc)

export function useAllTokenData(): {
  [address: string]: { data: TokenData | undefined; lastUpdated: number | undefined }
} {
  const [activeNetwork] = useActiveNetworkVersion()
  const allTokens = useSelector((state: AppState) => state.tokens.byAddress[activeNetwork.id] ?? {})

  // Filter tokens based on TOKEN_ALLOW_LIST
  return useMemo(() => {
    const filteredTokens: { [address: string]: { data: TokenData | undefined; lastUpdated: number | undefined } } = {}

    Object.keys(allTokens).forEach((address) => {
      if (TOKEN_ALLOW_LIST[activeNetwork.id]?.includes(address)) {
        filteredTokens[address] = allTokens[address]
      }
    })

    return filteredTokens
  }, [allTokens, activeNetwork.id])
}

export function useUpdateTokenData(): (tokens: TokenData[]) => void {
  const dispatch = useDispatch<AppDispatch>()
  const [activeNetwork] = useActiveNetworkVersion()

  return useCallback(
    (tokens: TokenData[]) => {
      dispatch(updateTokenData({ tokens, networkId: activeNetwork.id }))
    },
    [activeNetwork.id, dispatch],
  )
}

export function useAddTokenKeys(): (addresses: string[]) => void {
  const dispatch = useDispatch<AppDispatch>()
  const [activeNetwork] = useActiveNetworkVersion()
  return useCallback(
    (tokenAddresses: string[]) => dispatch(addTokenKeys({ tokenAddresses, networkId: activeNetwork.id })),
    [activeNetwork.id, dispatch],
  )
}

export function useTokenDatas(addresses: string[] | undefined): TokenData[] | undefined {
  const allTokenData = useAllTokenData()
  const addTokenKeys = useAddTokenKeys()

  // if token not tracked yet track it
  addresses?.map((a) => {
    if (!allTokenData[a]) {
      addTokenKeys([a])
    }
  })

  const data = useMemo(() => {
    if (!addresses) {
      return []
    }
    return addresses
      .map((a) => {
        return allTokenData[a]?.data
      })
      .filter(notEmpty) as TokenData[]
  }, [addresses, allTokenData])

  return data
}

export function useTokenData(address: string | undefined): TokenData | undefined {
  const allTokenData = useAllTokenData()
  const addTokenKeys = useAddTokenKeys()

  // if invalid address return
  if (!address || !isAddress(address)) {
    return undefined
  }

  // if token not tracked yet track it
  if (!allTokenData[address]) {
    addTokenKeys([address])
  }

  // return data
  return allTokenData[address]?.data
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function usePoolsForToken(address: string): string[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const [activeNetwork] = useActiveNetworkVersion()
  const token = useSelector((state: AppState) => state.tokens.byAddress[activeNetwork.id]?.[address])
  const poolsForToken = token.poolAddresses

  const [error, setError] = useState(false)
  const { dataClient } = useClients()

  useEffect(() => {
    async function fetch() {
      const { loading, error, addresses } = await fetchPoolsForToken(address, dataClient)
      if (!loading && !error && addresses) {
        // Filter addresses to only include those in POOL_ALLOW_LIST
        const filteredAddresses = addresses.filter((address) => POOL_ALLOW_LIST[activeNetwork.id]?.includes(address))
        dispatch(
          addPoolAddresses({
            tokenAddress: address,
            poolAddresses: filteredAddresses,
            networkId: activeNetwork.id,
          }),
        )
      }
      if (error) {
        setError(error)
      }
    }
    if (!poolsForToken && !error) {
      fetch()
    }
  }, [address, dispatch, error, poolsForToken, dataClient, activeNetwork.id])

  // Filter returned pools just in case stored data includes non-allowed pools
  return poolsForToken?.filter((address) => POOL_ALLOW_LIST[activeNetwork.id]?.includes(address))
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function useTokenChartData(address: string): TokenChartEntry[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const [activeNetwork] = useActiveNetworkVersion()
  const token = useSelector((state: AppState) => state.tokens.byAddress[activeNetwork.id]?.[address])
  const chartData = token.chartData
  const [error, setError] = useState(false)
  const { dataClient } = useClients()

  useEffect(() => {
    async function fetch() {
      const { error, data } = await fetchTokenChartData(address, dataClient)
      if (!error && data) {
        dispatch(updateChartData({ tokenAddress: address, chartData: data, networkId: activeNetwork.id }))
      }
      if (error) {
        setError(error)
      }
    }
    if (!chartData && !error) {
      fetch()
    }
  }, [address, dispatch, error, chartData, dataClient, activeNetwork.id])

  // return data
  return chartData
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function useTokenPriceData(
  address: string,
  interval: number,
  timeWindow: OpUnitType,
): PriceChartEntry[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const [activeNetwork] = useActiveNetworkVersion()
  const token = useSelector((state: AppState) => state.tokens.byAddress[activeNetwork.id]?.[address])
  const priceData = token?.priceData?.[interval]
  const [error, setError] = useState(false)
  const [fetching, setFetching] = useState(false)
  const { dataClient, blockClient } = useClients()

  // construct timestamps and check if we need to fetch more data
  const oldestTimestampFetched = token?.priceData?.oldestFetchedTimestamp
  const utcCurrentTime = dayjs()
  const startTimestamp = utcCurrentTime.subtract(1, timeWindow).startOf('hour').unix()

  useEffect(() => {
    async function fetch() {
      if (fetching) return // Evita fetch multipli simultanei
      
      setFetching(true)
      console.log('Fetching price data for token:', address, 'interval:', interval, 'startTimestamp:', startTimestamp)
      
      try {
        const { data, error: fetchingError } = await fetchTokenPriceData(
          address,
          interval,
          startTimestamp,
          dataClient,
          blockClient,
        )
        console.log('Price data fetch result:', { data: data?.length, error: fetchingError })
        
        if (data) {
          dispatch(
            updatePriceData({
              tokenAddress: address,
              secondsInterval: interval,
              priceData: data,
              oldestFetchedTimestamp: startTimestamp,
              networkId: activeNetwork.id,
            }),
          )
        }
        if (fetchingError) {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching price data:', err)
        setError(true)
      } finally {
        setFetching(false)
      }
    }

    if (!priceData && !error && !fetching && token) {
      console.log('Price data not found, fetching...', { address, priceData, error, token: !!token, fetching })
      fetch()
    }
  }, [
    activeNetwork.id,
    address,
    blockClient,
    dataClient,
    dispatch,
    error,
    fetching,
    interval,
    oldestTimestampFetched,
    priceData,
    startTimestamp,
    timeWindow,
    token,
  ])

  // return data
  return priceData
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function useTokenTransactions(address: string): Transaction[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const [activeNetwork] = useActiveNetworkVersion()
  const token = useSelector((state: AppState) => state.tokens.byAddress[activeNetwork.id]?.[address])
  const transactions = token?.transactions
  const [error, setError] = useState(false)
  const { dataClient } = useClients()

  useEffect(() => {
    async function fetch() {
      const { error, data } = await fetchTokenTransactions(address, dataClient, activeNetwork.id)
      if (error) {
        setError(true)
      } else if (data) {
        dispatch(updateTransactions({ tokenAddress: address, transactions: data, networkId: activeNetwork.id }))
      }
    }
    if (!transactions && !error) {
      fetch()
    }
  }, [activeNetwork.id, address, dataClient, dispatch, error, transactions, token])

  return transactions
}
