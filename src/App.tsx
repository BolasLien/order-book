import {useState} from 'react'
import QuoteGroup from './components/QuoteGroup'
import useOrderbook from './hooks/useOrderbook'
import useLastPrice from './hooks/useLastPrice'
import LastPrice from './components/CurrentPrice'

const OrderBook = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {orderbook} = useOrderbook(isOpen)
  const {lastPrice} = useLastPrice(isOpen)

  return (
    <div className="h-dvh flex flex-col justify-center items-center gap-5">
      <div className="bg-order-book-bg text-order-book-text w-[300px]">
        <h2 className="text-lg font-bold mb-2 py-1 border-b border-quote-row-hover">Order Book</h2>

        {/* 表頭 */}
        <div className="flex px-2 py-1 text-quote-head text-sm ">
          <span className="flex-1">Price (USD)</span>
          <span className="flex-1 text-end">Size</span>
          <span className="flex-1 text-end">Total</span>
        </div>
        <div className="flex flex-col">
          {/* 賣單 */}
          <div className="flex flex-col">
            <QuoteGroup orders={orderbook?.asks} type={'sell'} />
          </div>

          {/* 最新成交價 */}
          <LastPrice lastPrice={lastPrice} />

          {/* 買單 */}
          <div className="flex flex-col">
            <QuoteGroup orders={orderbook?.bids} type={'buy'} />
          </div>
        </div>
      </div>
      <button
        className="bg-sky-500 hover:bg-sky-700 text-white py-2 px-4 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close' : 'Open'} WebSocket
      </button>
    </div>
  )
}

export default OrderBook
