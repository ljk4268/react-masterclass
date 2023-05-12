import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { fetchCoinHistory } from '../api'
import ApexCharts from 'react-apexcharts'

interface IHistoricalData {
  time_open: number
  time_close: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  market_cap: number
}

function Chart() {
  const { coinId } = useParams()
  const { isLoading, data } = useQuery<IHistoricalData[]>(
    ['ohlcv', coinId],
    () => fetchCoinHistory(coinId)
  )

  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ApexCharts
          type="candlestick"
          series={
            [
              {
                data: data?.map(price => {
                  return {
                    x: price.time_close,
                    y: [
                      Number(price.open).toFixed(3),
                      Number(price.high).toFixed(3),
                      Number(price.low).toFixed(3),
                      Number(price.close).toFixed(3),
                    ],
                  }
                }),
              },
            ] as any
          }
          options={{
            theme: { mode: 'dark' },
            chart: {
              type: 'candlestick',
              height: 350,
              width: 500,
              toolbar: { show: false },
              background: 'transparent',
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              axisTicks: { show: false },
              axisBorder: { show: false },
              labels: { show: false },
              type: 'datetime',
              categories: data?.map(price =>
                new Date(price.time_close * 1000).toISOString()
              ),
            },
          }}
        />
      )}
    </div>
  )
}

export default Chart
