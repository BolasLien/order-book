import {Quote} from '../../hooks/useOrderbook'
import {formatNumber} from '../../utils/formatters'

type QuoteType = 'buy' | 'sell'

type QuoteGroupProps = {
  orders?: Quote[]
  type: QuoteType
}

/**
 * 計算百分比
 * @param part 部分值
 * @param total 總值
 * @returns 百分比 (0-100)
 */
const calculatePercentage = (part: string, total: string | number): number => {
  const partNum = typeof part === 'string' ? parseFloat(part) : part
  const totalNum = typeof total === 'string' ? parseFloat(total) : total

  if (totalNum === 0 || isNaN(partNum) || isNaN(totalNum)) {
    return 0
  }

  return (partNum / totalNum) * 100
}

const newQuoteBg = {
  buy: `before:bg-blink-green`,
  sell: `before:bg-blink-red`,
}

const sizeBg = {
  up: 'before:bg-blink-green',
  down: 'before:bg-blink-red',
  same: '',
}

const totalBg = {
  buy: 'bg-buy-total-bar',
  sell: 'bg-sell-total-bar',
}

const QuoteGroup = ({orders, type}: QuoteGroupProps) => {
  const placeholderData: Quote[] = Array.from({length: 8}, (_, index) => ({
    price: '21699.0' + index,
    size: '3691' + index,
    total: type === 'buy' ? `${33 * (index + 1)}` : `${33 * (8 - index)}`,
    isNew: index === 3,
    sizeDirection: index === 5 ? 'up' : index === 7 ? 'down' : 'same',
  }))

  const data = orders || placeholderData

  // 取得所有報價的最大累積總量
  const maxTotal = Math.max(...data.map(order => parseFloat(order.total || '0')))

  return data.map(({price, size, sizeDirection = 'same', total = '0', isNew}) => (
    <div
      key={price}
      className={`${
        isNew ? newQuoteBg[type] : ''
      } relative flex items-center hover:bg-quote-row-hover px-2 py-1 text-sm gap-2 before:animate-blink before:opacity-0 before:content-[''] before:absolute before:w-full before:h-full before:-mx-2`}
    >
      <div className={`flex-1 text-${type}-price`}>{formatNumber(price, 1)}</div>
      <div
        className={`${sizeBg[sizeDirection]} flex-1 relative before:animate-size-blink before:opacity-0 before:content-[''] before:absolute before:w-full before:h-full`}
      >
        <div className="text-end text-order-book-text">{formatNumber(size)}</div>
      </div>
      <div className={`relative flex-1 overflow-hidden`}>
        <div
          className={`absolute w-full h-full bg-amber-50 ${totalBg[type]}`}
          style={{
            transform: `translateX(${100 - calculatePercentage(total, maxTotal)}%)`,
          }}
        ></div>
        <div className="text-end text-order-book-text">{formatNumber(total)}</div>
      </div>
    </div>
  ))
}

export default QuoteGroup
