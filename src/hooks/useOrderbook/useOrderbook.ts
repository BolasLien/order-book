import {useEffect, useState} from 'react'

export type SizeDirection = 'up' | 'down' | 'same'

export type Quote = {
  price: string
  size: string
  total?: string
  isNew?: boolean
  sizeDirection?: SizeDirection
}

type Orderbook = {
  bids: Quote[]
  asks: Quote[]
  seqNum: number
  prevSeqNum: number
  type: 'snapshot' | 'delta'
  timestamp: number
  symbol: string
}

type OrderbookResponse = {
  data: Omit<Orderbook, 'bids' | 'asks'> & {
    bids: [string, string][]
    asks: [string, string][]
  }
  topic: string
}

/**
 * 計算訂單簿的 Total（累積總量）
 * @param orders 買單或賣單的陣列
 * @param isBuy 是否為買單（bids = true, asks = false）
 * @returns 附加 `total` 的新陣列
 */
function updateQuiteTotal(Quote: Quote[], isBuy: boolean): Quote[] {
  let total = 0

  const addToTotal = (order: Quote) => {
    total += Number(order.size)
    return {...order, total: total.toString()}
  }

  if (!isBuy) {
    // 賣單需要反轉順序
    const reversedQuote = [...Quote].map(addToTotal)

    return reversedQuote.reverse()
  }

  return [...Quote].map(addToTotal)
}

const toQuote = (order: [string, string]): Quote => {
  return {
    price: order[0],
    size: order[1],
    total: '0',
    isNew: false,
    sizeDirection: 'same',
  }
}

/**
 * 更新訂單簿的報價
 * @param quotes 舊的報價
 * @param price 價格
 * @param size 數量
 * @returns 更新後的報價
 */
const updateOrderQuotes = (quotes: Quote[], price: string, size: string): Quote[] => {
  const updatedQuotes = [...quotes]
  const index = updatedQuotes.findIndex(quote => quote.price === price)

  // 當數量為 0 時，移除價格
  if (parseFloat(size) === 0) {
    if (index !== -1) {
      updatedQuotes.splice(index, 1)
    }
  } else if (index !== -1) {
    // 更新已存在的價格
    const prevSize = Number(updatedQuotes[index].size)
    let sizeDirection: 'up' | 'down' | 'same' = 'same'
    if (prevSize < Number(size)) {
      sizeDirection = 'up'
    } else if (prevSize > Number(size)) {
      sizeDirection = 'down'
    }
    updatedQuotes[index] = {
      ...updatedQuotes[index],
      size,
      sizeDirection,
    }
  } else {
    // 加入新的價格，標記 isNew 並預設 sizeDirection 為 'same'
    updatedQuotes.push({price, size, total: '0', isNew: true, sizeDirection: 'same'})
  }

  return updatedQuotes
}

const useOrderbook = (open: boolean = false) => {
  const [orderbook, setOrderbook] = useState<Orderbook | null>(null)

  useEffect(() => {
    if (!open) return
    const socket = new WebSocket('wss://ws.btse.com/ws/oss/futures')

    socket.onopen = () => {
      console.log('訂單 WebSocket 連線成功')
      socket.send(JSON.stringify({op: 'subscribe', args: ['update:BTCPFC_0']}))
    }

    socket.onmessage = event => {
      const res: OrderbookResponse = JSON.parse(event.data)
      // console.log('收到訊息:', res)

      if (!res.data) return

      if (res.data.seqNum !== res.data.prevSeqNum + 1) {
        console.error('訊息順序錯誤，重新連線')
        socket.send(JSON.stringify({op: 'unsubscribe', args: ['update:BTCPFC_0']}))
        // socket.send(JSON.stringify({op: 'subscribe', args: ['update:BTCPFC_0']}))
        return
      }

      // 第一次取得快照
      if (res.data.type === 'snapshot') {
        const bids = res.data.bids
          .map(toQuote)
          .sort((a, b) => parseFloat(b.price) - parseFloat(a.price)) // 降序
          .slice(0, 8)

        const asks = res.data.asks
          .map(toQuote)
          .sort((a, b) => parseFloat(a.price) - parseFloat(b.price)) // 升序
          .slice(0, 8)

        const newOrderbook = {
          ...res.data,
          bids: updateQuiteTotal(bids, true),
          asks: updateQuiteTotal(asks, false),
        }

        setOrderbook(newOrderbook)
      } else if (res.data.type === 'delta') {
        setOrderbook(prevOrderbook => {
          if (!prevOrderbook) return prevOrderbook

          const currentBook = {...prevOrderbook}

          // 更新買單
          res.data.bids.forEach(([price, size]) => {
            currentBook.bids = updateOrderQuotes(currentBook.bids, price, size)
          })

          // 更新賣單
          res.data.asks.forEach(([price, size]) => {
            currentBook.asks = updateOrderQuotes(currentBook.asks, price, size)
          })

          // 重新排序
          currentBook.bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)) // 買單降序
          currentBook.asks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)) // 賣單升序

          // 只保留前 8 筆資料
          currentBook.bids = currentBook.bids.slice(0, 8)
          currentBook.asks = currentBook.asks.slice(0, 8)

          // 重新計算累計量
          currentBook.bids = updateQuiteTotal(currentBook.bids, true)
          currentBook.asks = updateQuiteTotal(currentBook.asks, false)

          // 更新其餘資料
          currentBook.seqNum = res.data.seqNum
          currentBook.prevSeqNum = res.data.prevSeqNum
          currentBook.timestamp = res.data.timestamp
          currentBook.symbol = res.data.symbol
          currentBook.type = res.data.type

          // 檢查交叉訂單簿 (crossed orderbook)
          if (currentBook.bids.length > 0 && currentBook.asks.length > 0) {
            const bestBid = parseFloat(currentBook.bids[0].price)
            const bestAsk = parseFloat(currentBook.asks[0].price)
            if (bestBid >= bestAsk) {
              console.error('交叉訂單簿，重新連線')
              socket.send(JSON.stringify({op: 'unsubscribe', args: ['update:BTCPFC_0']}))
              // socket.send(JSON.stringify({op: 'subscribe', args: ['update:BTCPFC_0']}))
              return prevOrderbook
            }
          }

          return currentBook
        })
      }
    }

    socket.onerror = event => {
      console.error('訂單 WebSocket 錯誤:', event)
    }

    socket.onclose = () => {
      console.log('訂單 WebSocket 連線關閉')
    }

    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [open])

  return {orderbook}
}

export default useOrderbook
