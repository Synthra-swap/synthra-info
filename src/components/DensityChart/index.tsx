import { fetchTicksSurroundingPrice, TickProcessed } from 'data/pools/tickData'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { BarChart, Bar, LabelList, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Loader from 'components/Loader'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { usePoolDatas, usePoolTickData } from 'state/pools/hooks'
import { MAX_UINT128 } from '../../constants/index'
import { isAddress } from 'utils'
import { Pool, TickMath, TICK_SPACINGS, FeeAmount } from '@uniswap/v3-sdk'
import { PoolData } from 'state/pools/reducer'
import { CurrentPriceLabel } from './CurrentPriceLabel'
import CustomToolTip from './CustomToolTip'
import { Token, CurrencyAmount } from '@synthra-swap/sdk-core'
import JSBI from 'jsbi'
import { useClients } from 'state/application/hooks'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
`

const ControlsWrapper = styled.div`
  position: absolute;
  right: 40px;
  bottom: 100px;
  padding: 4px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 6px;
`

const ActionButton = styled.div<{ disabled?: boolean }>`
  width: 32x;
  border-radius: 50%;
  background-color: black;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 0.9)};
  background-color: ${({ theme, disabled }) => (disabled ? theme.bg3 : theme.bg2)};
  user-select: none;

  :hover {
    cursor: pointer;
    opacity: 0.4;
  }
`

interface DensityChartProps {
  address: string
}

export interface ChartEntry {
  index: number
  isCurrent: boolean
  activeLiquidity: number
  price0: number
  price1: number
  tvlToken0: number
  tvlToken1: number
}

interface ZoomStateProps {
  left: number
  right: number
  refAreaLeft: string | number
  refAreaRight: string | number
}

const INITIAL_TICKS_TO_FETCH = 200
const ZOOM_INTERVAL = 20

const initialState = {
  left: 0,
  right: INITIAL_TICKS_TO_FETCH * 2 + 1,
  refAreaLeft: '',
  refAreaRight: '',
}

export default function DensityChart({ address }: DensityChartProps) {
  const theme = useTheme()
  const { dataClient } = useClients()

  // poolData
  const poolData: PoolData = usePoolDatas([address])[0]
  const formattedAddress0 = isAddress(poolData.token0.address)
  const formattedAddress1 = isAddress(poolData.token1.address)
  const feeTier = poolData?.feeTier

  // parsed tokens
  const token0 = useMemo(() => {
    return poolData && formattedAddress0 && formattedAddress1
      ? new Token(1, formattedAddress0, poolData.token0.decimals)
      : undefined
  }, [formattedAddress0, formattedAddress1, poolData])
  const token1 = useMemo(() => {
    return poolData && formattedAddress1 && formattedAddress1
      ? new Token(1, formattedAddress1, poolData.token1.decimals)
      : undefined
  }, [formattedAddress1, poolData])

  // tick data tracking
  const [poolTickData, updatePoolTickData] = usePoolTickData(address)
  const [ticksToFetch, setTicksToFetch] = useState(INITIAL_TICKS_TO_FETCH)
  const amountTicks = ticksToFetch * 2 + 1

  const [loading, setLoading] = useState(false)
  const [zoomState, setZoomState] = useState<ZoomStateProps>(initialState)

  useEffect(() => {
    async function fetch() {
      const { data } = await fetchTicksSurroundingPrice(address, dataClient, ticksToFetch)
      if (data) {
        updatePoolTickData(address, data)
      }
    }
    if (!poolTickData || (poolTickData && poolTickData.ticksProcessed.length < amountTicks)) {
      fetch()
    }
  }, [address, poolTickData, updatePoolTickData, ticksToFetch, amountTicks, dataClient])

  const [formattedData, setFormattedData] = useState<ChartEntry[] | undefined>()
  useEffect(() => {
    async function formatData() {
      if (poolTickData) {
        const newData = await Promise.all(
          poolTickData.ticksProcessed.map(async (t: TickProcessed, i) => {
            const active = t.tickIdx === poolTickData.activeTickIdx
            const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(t.tickIdx)
            const feeAmount: FeeAmount = poolData.feeTier
            const mockTicks = [
              {
                index: t.tickIdx - TICK_SPACINGS[feeAmount],
                liquidityGross: t.liquidityGross,
                liquidityNet: JSBI.multiply(t.liquidityNet, JSBI.BigInt('-1')),
              },
              {
                index: t.tickIdx,
                liquidityGross: t.liquidityGross,
                liquidityNet: t.liquidityNet,
              },
            ]
            const pool =
              token0 && token1 && feeTier
                ? new Pool(token0, token1, feeTier, sqrtPriceX96, t.liquidityActive, t.tickIdx, mockTicks)
                : undefined
            const nextSqrtX96 = poolTickData.ticksProcessed[i - 1]
              ? TickMath.getSqrtRatioAtTick(poolTickData.ticksProcessed[i - 1].tickIdx)
              : undefined
            const maxAmountToken0 = token0 ? CurrencyAmount.fromRawAmount(token0, MAX_UINT128.toString()) : undefined
            const outputRes0 =
              pool && maxAmountToken0 ? await pool.getOutputAmount(maxAmountToken0, nextSqrtX96) : undefined

            const token1Amount = outputRes0?.[0] as CurrencyAmount<Token> | undefined

            const amount0 = token1Amount ? parseFloat(token1Amount.toExact()) * parseFloat(t.price1) : 0
            const amount1 = token1Amount ? parseFloat(token1Amount.toExact()) : 0

            return {
              index: i,
              isCurrent: active,
              activeLiquidity: parseFloat(t.liquidityActive.toString()),
              price0: parseFloat(t.price0),
              price1: parseFloat(t.price1),
              tvlToken0: amount0,
              tvlToken1: amount1,
            }
          }),
        )
        // offset the values to line off bars with TVL used to swap across bar
        newData?.map((entry, i) => {
          if (i > 0) {
            newData[i - 1].tvlToken0 = entry.tvlToken0
            newData[i - 1].tvlToken1 = entry.tvlToken1
          }
        })

        if (newData) {
          if (loading) {
            setLoading(false)
          }
          setFormattedData(newData)
        }
        return
      } else {
        return []
      }
    }
    if (!formattedData) {
      formatData()
    }
  }, [feeTier, formattedData, loading, poolData.feeTier, poolTickData, token0, token1])

  const atZoomMax = zoomState.left + ZOOM_INTERVAL >= zoomState.right - ZOOM_INTERVAL - 1
  const atZoomMin = zoomState.left - ZOOM_INTERVAL < 0

  const handleZoomIn = useCallback(() => {
    !atZoomMax &&
      setZoomState({
        ...zoomState,
        left: zoomState.left + ZOOM_INTERVAL,
        right: zoomState.right - ZOOM_INTERVAL,
      })
  }, [zoomState, atZoomMax])

  const handleZoomOut = useCallback(() => {
    if (atZoomMin) {
      setLoading(true)
      setTicksToFetch(ticksToFetch + ZOOM_INTERVAL)
      setFormattedData(undefined)
      setZoomState({
        ...zoomState,
        left: 0,
        right: amountTicks,
      })
    } else {
      setZoomState({
        ...zoomState,
        left: zoomState.left - ZOOM_INTERVAL,
        right: zoomState.right + ZOOM_INTERVAL,
      })
    }
  }, [amountTicks, atZoomMin, ticksToFetch, zoomState])

  const zoomedData = useMemo(() => {
    if (formattedData) {
      return formattedData.slice(zoomState.left, zoomState.right)
    }
    return undefined
  }, [formattedData, zoomState.left, zoomState.right])

  // reset data on address change
  useEffect(() => {
    setFormattedData(undefined)
  }, [address])

  if (!poolTickData) {
    return <Loader />
  }

  const CustomBar = ({
    x,
    y,
    width,
    height,
    fill,
  }: {
    x: number
    y: number
    width: number
    height: number
    fill: string
  }) => {
    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
      return null
    }
    return (
      <g>
        <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
      </g>
    )
  }
  return (
    <Wrapper>
      {!loading ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={zoomedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <Tooltip
              content={(props) => (
                <CustomToolTip chartProps={props} poolData={poolData} currentPrice={poolData.token0Price} />
              )}
            />
            <XAxis reversed={true} tick={false} />
            <Bar
              dataKey="activeLiquidity"
              fill="#2172E5"
              isAnimationActive={false}
              shape={(props) => {
                // eslint-disable-next-line react/prop-types
                return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={props.fill} />
              }}
            >
              {zoomedData?.map((entry, index) => {
                return <Cell key={`cell-${index}`} fill={entry.isCurrent ? theme?.pink1 : theme?.blue1} />
              })}
              <LabelList
                dataKey="activeLiquidity"
                position="inside"
                content={(props) => <CurrentPriceLabel chartProps={props} poolData={poolData} data={zoomedData} />}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Loader />
      )}
      <ControlsWrapper>
        <ActionButton disabled={false} onClick={handleZoomOut}>
          -
        </ActionButton>
        <ActionButton disabled={atZoomMax} onClick={handleZoomIn}>
          +
        </ActionButton>
      </ControlsWrapper>
    </Wrapper>
  )
}
