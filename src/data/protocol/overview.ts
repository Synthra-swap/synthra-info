import { getPercentChange } from '../../utils/data'
import { ProtocolData } from '../../state/protocol/reducer'
import gql from 'graphql-tag'
import { useQuery, ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useDeltaTimestamps } from 'utils/queries'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { useMemo } from 'react'
import { useClients } from 'state/application/hooks'
// import { useTVLAllowed, useTVLOffset } from './derived'
import { POOL_ALLOW_LIST } from '../../constants'
import { useActiveNetworkVersion } from 'state/application/hooks'

// Modified query to fetch specific pools
export const POOLS_DATA = (poolAddresses: string[], block?: string) => {
  const queryString = `
    query pools {
      pools(
        where: { id_in: ${JSON.stringify(poolAddresses)} }
        ${block !== undefined ? `block: { number: ${block}}` : ``}
        subgraphError: allow
      ) {
        id
        txCount
        volumeUSD
        feesUSD
        totalValueLockedUSD
      }
    }
  `
  return gql(queryString)
}

interface PoolResponse {
  pools: {
    id: string
    txCount: string
    volumeUSD: string
    feesUSD: string
    totalValueLockedUSD: string
  }[]
}

export function useFetchProtocolData(
  dataClientOverride?: ApolloClient<NormalizedCacheObject>,
  blockClientOverride?: ApolloClient<NormalizedCacheObject>,
): {
  loading: boolean
  error: boolean
  data: ProtocolData | undefined
} {
  const { dataClient, blockClient } = useClients()
  const activeDataClient = dataClientOverride ?? dataClient
  const activeBlockClient = blockClientOverride ?? blockClient
  const [activeNetwork] = useActiveNetworkVersion()

  // Get allowed pool addresses for current network
  const allowedPools = POOL_ALLOW_LIST[activeNetwork.id] ?? []

  // get blocks from historic timestamps
  const [t24, t48] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48], activeBlockClient)
  const [block24, block48] = blocks ?? []

  // fetch all data for allowed pools
  const { loading, error, data } = useQuery<PoolResponse>(POOLS_DATA(allowedPools), {
    client: activeDataClient,
  })

  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useQuery<PoolResponse>(POOLS_DATA(allowedPools, block24?.number ?? 0), { client: activeDataClient })

  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useQuery<PoolResponse>(POOLS_DATA(allowedPools, block48?.number ?? 0), { client: activeDataClient })

  const anyError = Boolean(error || error24 || error48 || blockError)
  const anyLoading = Boolean(loading || loading24 || loading48)

  const formattedData: ProtocolData | undefined = useMemo(() => {
    if (anyError || anyLoading || !data?.pools || !blocks) {
      return undefined
    }

    // Aggregate current data
    const aggregate = data.pools.reduce(
      (acc, pool) => {
        acc.txCount += parseFloat(pool.txCount)
        acc.volumeUSD += parseFloat(pool.volumeUSD)
        acc.feesUSD += parseFloat(pool.feesUSD)
        acc.tvlUSD += parseFloat(pool.totalValueLockedUSD)
        return acc
      },
      { txCount: 0, volumeUSD: 0, feesUSD: 0, tvlUSD: 0 },
    )

    // Aggregate 24h ago data
    const aggregate24 = data24?.pools.reduce(
      (acc, pool) => {
        acc.txCount += parseFloat(pool.txCount)
        acc.volumeUSD += parseFloat(pool.volumeUSD)
        acc.feesUSD += parseFloat(pool.feesUSD)
        acc.tvlUSD += parseFloat(pool.totalValueLockedUSD)
        return acc
      },
      { txCount: 0, volumeUSD: 0, feesUSD: 0, tvlUSD: 0 },
    )

    // Aggregate 48h ago data
    const aggregate48 = data48?.pools.reduce(
      (acc, pool) => {
        acc.txCount += parseFloat(pool.txCount)
        acc.volumeUSD += parseFloat(pool.volumeUSD)
        acc.feesUSD += parseFloat(pool.feesUSD)
        acc.tvlUSD += parseFloat(pool.totalValueLockedUSD)
        return acc
      },
      { txCount: 0, volumeUSD: 0, feesUSD: 0, tvlUSD: 0 },
    )

    // Calculate changes
    const volumeUSD = aggregate24 ? aggregate.volumeUSD - aggregate24.volumeUSD : aggregate.volumeUSD
    const volumeOneWindowAgo = aggregate24 && aggregate48 ? aggregate24.volumeUSD - aggregate48.volumeUSD : undefined
    const volumeUSDChange =
      volumeUSD && volumeOneWindowAgo ? ((volumeUSD - volumeOneWindowAgo) / volumeOneWindowAgo) * 100 : 0

    const txCount = aggregate24 ? aggregate.txCount - aggregate24.txCount : aggregate.txCount
    const txCountOneWindowAgo = aggregate24 && aggregate48 ? aggregate24.txCount - aggregate48.txCount : undefined
    const txCountChange =
      txCount && txCountOneWindowAgo ? getPercentChange(txCount.toString(), txCountOneWindowAgo.toString()) : 0

    const feesUSD = aggregate24 ? aggregate.feesUSD - aggregate24.feesUSD : aggregate.feesUSD
    const feesOneWindowAgo = aggregate24 && aggregate48 ? aggregate24.feesUSD - aggregate48.feesUSD : undefined
    const feeChange =
      feesUSD && feesOneWindowAgo ? getPercentChange(feesUSD.toString(), feesOneWindowAgo.toString()) : 0

    return {
      volumeUSD,
      volumeUSDChange,
      tvlUSD: aggregate.tvlUSD,
      tvlUSDChange: getPercentChange(aggregate.tvlUSD.toString(), aggregate24?.tvlUSD?.toString()),
      feesUSD,
      feeChange,
      txCount,
      txCountChange,
    }
  }, [anyError, anyLoading, blocks, data, data24, data48])

  return {
    loading: anyLoading,
    error: anyError,
    data: formattedData,
  }
}
