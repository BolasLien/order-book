/**
 * 將數字格式化為帶千分位分隔符的字串
 * @param value 要格式化的數值或字串
 * @param decimals 保留的小數位數 (選填)
 * @returns 格式化後的字串
 */
export const formatNumber = (value: string | number, decimals?: number): string => {
  if (value === undefined || value === null || value === '') {
    return '0'
  }

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) {
    return '0'
  }

  let formattedValue = num
  if (decimals !== undefined) {
    formattedValue = parseFloat(num.toFixed(decimals))
  }

  return formattedValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals || 0,
    maximumFractionDigits: decimals !== undefined ? decimals : 2, // 最多保留 2 位小數
  })
}
