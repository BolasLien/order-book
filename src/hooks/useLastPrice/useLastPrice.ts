import {useState, useEffect} from 'react'

export type LastPrice = {
  price: string
  timestamp: number
  direction: 'up' | 'down' | 'same'
}

type TradeHistoryResponse = {
  data: {
    price: string
    size: string
    side: number
    timestamp: number
  }[]
  topic: string
}

const useLastPrice = (open: boolean) => {
  const [lastPrice, setLastPrice] = useState<LastPrice | null>(null)

  useEffect(() => {
    if (!open) return

    let socket: WebSocket | null = null

    socket = new WebSocket('wss://ws.btse.com/ws/futures')

    socket.onopen = () => {
      console.log('價格 WebSocket 連線成功')
      socket.send(JSON.stringify({op: 'subscribe', args: ['tradeHistoryApi:BTCPFC']}))
    }

    socket.onmessage = event => {
      const res: TradeHistoryResponse = JSON.parse(event.data)
      // console.log('收到訊息:', res)

      if (!res.data || !res.data.length || !res.topic.includes('tradeHistoryApi')) return

      const newPrice = res.data[0].price

      setLastPrice(prev => {
        // 判斷價格方向
        let direction: 'up' | 'down' | 'same' = 'same'
        if (prev) {
          if (parseFloat(newPrice) > parseFloat(prev.price)) {
            direction = 'up'
          } else if (parseFloat(newPrice) < parseFloat(prev.price)) {
            direction = 'down'
          }
        }

        return {
          price: newPrice,
          timestamp: res.data[0].timestamp,
          direction,
        }
      })
    }

    socket.onerror = event => {
      console.error('價格 WebSocket 錯誤:', event)
    }

    socket.onclose = () => {
      console.log('價格 WebSocket 連線關閉')
    }

    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [open])

  return {lastPrice}
}

export default useLastPrice
