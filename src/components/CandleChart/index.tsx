import React, { useRef, useState, useEffect, useCallback, Dispatch, SetStateAction, ReactNode } from 'react'
import { createChart, IChartApi } from 'lightweight-charts'
import { RowBetween } from 'components/Row'
import Card from '../Card'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import useTheme from 'hooks/useTheme'

dayjs.extend(utc)

const Wrapper = styled(Card)`
  width: 100%;
  padding: 1rem;
  display: flex;
  background-color: ${({ theme }) => theme.bg0};
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`

const DEFAULT_HEIGHT = 300

export type LineChartProps = {
  data: any[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for value label on hover
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
} & React.HTMLAttributes<HTMLDivElement>

const CandleChart = ({
  data,
  color = '#56B2A4',
  setValue,
  setLabel,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  height = DEFAULT_HEIGHT,
  minHeight = DEFAULT_HEIGHT,
  ...rest
}: LineChartProps) => {
  const theme = useTheme()
  const textColor = theme?.text3
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartCreated, setChart] = useState<IChartApi | undefined>()

  // Debug: log the data to see what's being passed
  useEffect(() => {
    console.log('CandleChart data:', data)
    console.log('CandleChart data length:', data?.length)
  }, [data])

  const handleResize = useCallback(() => {
    if (chartCreated && chartRef?.current?.parentElement) {
      chartCreated.resize(chartRef.current.parentElement.clientWidth - 32, height)
      chartCreated.timeScale().fitContent()
      chartCreated.timeScale().scrollToPosition(0, false)
    }
  }, [chartCreated, chartRef, height])

  // add event listener for resize
  const isClient = typeof window === 'object'
  useEffect(() => {
    if (!isClient) {
      return
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient, chartRef, handleResize]) // Empty array ensures that effect is only run on mount and unmount

  // Create and manage chart
  useEffect(() => {
    if (!data || !chartRef?.current?.parentElement) {
      return
    }

    // Clear any existing content
    if (chartRef.current) {
      chartRef.current.innerHTML = ''
    }

    // Remove existing chart if it exists
    if (chartCreated) {
      chartCreated.remove()
    }
    
    const chart = createChart(chartRef.current, {
      height: height,
      width: chartRef.current.parentElement.clientWidth - 32,
      layout: {
        backgroundColor: 'transparent',
        textColor: theme?.text3 || '#8B8D97',
        fontFamily: 'Inter var',
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        secondsVisible: true,
        tickMarkFormatter: (unixTime: number) => {
          return dayjs.unix(unixTime).format('MM/DD h:mm A')
        },
      },
      watermark: {
        visible: false,
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        mode: 1,
        vertLine: {
          visible: true,
          labelVisible: false,
          style: 3,
          width: 1,
          color: '#505050',
          labelBackgroundColor: color,
        },
      },
    })

    const series = chart.addCandlestickSeries({
      upColor: theme?.green1 || '#10B981',
      downColor: theme?.red1 || '#EF4444',
      borderDownColor: theme?.red1 || '#EF4444',
      borderUpColor: theme?.green1 || '#10B981',
      wickDownColor: theme?.red1 || '#EF4444',
      wickUpColor: theme?.green1 || '#10B981',
    })

    series.setData(data)
    chart.timeScale().fitContent()

    // update the title when hovering on the chart
    const unsubscribe = chart.subscribeCrosshairMove(function (param) {
      if (
        chartRef?.current &&
        (param === undefined ||
          param.time === undefined ||
          (param && param.point && param.point.x < 0) ||
          (param && param.point && param.point.x > chartRef.current.clientWidth) ||
          (param && param.point && param.point.y < 0) ||
          (param && param.point && param.point.y > height))
      ) {
        // reset values
        setValue && setValue(undefined)
        setLabel && setLabel(undefined)
      } else if (series && param) {
        const timestamp = param.time as number
        const time = dayjs.unix(timestamp).utc().format('MMM D, YYYY h:mm A') + ' (UTC)'
        const parsed = param.seriesPrices.get(series) as { open: number } | undefined
        setValue && setValue(parsed?.open)
        setLabel && setLabel(time)
      }
    })

    setChart(chart)

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      if (chart) {
        chart.remove()
      }
    }
  }, [data, height, setValue, setLabel, theme, color])

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (chartCreated) {
        chartCreated.remove()
        setChart(undefined)
      }
    }
  }, [])

  return (
    <Wrapper $minHeight={minHeight}>
      <RowBetween>
        {topLeft ?? null}
        {topRight ?? null}
      </RowBetween>
      <div ref={chartRef} id={'candle-chart'} {...rest} />
      <RowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </RowBetween>
    </Wrapper>
  )
}

export default CandleChart
