import type {LastPrice} from '../../hooks/useLastPrice'
import {formatNumber} from '../../utils/formatters'
import IconArrowDown from '../IconArrowDown'

type LastPriceProps = {
  lastPrice: LastPrice | null
}

const textStyle = {
  up: 'text-buy-price',
  down: 'text-sell-price',
  same: 'text-order-color-text',
}

const bgStyle = {
  up: 'bg-buy-total-bar',
  down: 'bg-sell-total-bar',
  same: 'bg-default-total-bar',
}

const arrowStyle = {
  up: 'rotate-180 text-buy-price',
  down: 'rotate-none text-sell-price',
  same: 'opacity-0',
}

const CurrentPrice = ({lastPrice}: LastPriceProps) => {
  const {price, direction} = lastPrice ?? {price: '21657.5', direction: 'up'}

  return (
    <div
      className={`${bgStyle[direction]} relative flex justify-center items-center font-bold text-lg  gap-1`}
    >
      <div className={textStyle[direction]}>{formatNumber(price, 1)}</div>
      <div className={`${arrowStyle[direction]} w-4 h-4 absolute right-23`}>
        <IconArrowDown />
      </div>
    </div>
  )
}

export default CurrentPrice
