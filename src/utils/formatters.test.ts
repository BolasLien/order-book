import {describe, it, expect} from 'vitest'
import {formatNumber} from './formatters'

describe('formatNumber', () => {
  it('應該將數字格式化為帶千分位分隔符的字串', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('應該將字串格式化為帶千分位分隔符的字串', () => {
    expect(formatNumber('1234567')).toBe('1,234,567')
  })

  it('應該將數字格式化為帶千分位分隔符且保留小數位數的字串', () => {
    expect(formatNumber(1234567.89, 2)).toBe('1,234,567.89')
  })

  it('應該將字串格式化為帶千分位分隔符且保留小數位數的字串', () => {
    expect(formatNumber('1234567.89', 2)).toBe('1,234,567.89')
  })

  it('應該在數值為空時返回 "0"', () => {
    expect(formatNumber('')).toBe('0')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(formatNumber()).toBe('0')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(formatNumber(null)).toBe('0')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(formatNumber(undefined)).toBe('0')
  })

  it('應該在數值無效時返回 "0"', () => {
    expect(formatNumber('abc')).toBe('0')
  })

  it('應該在未指定小數位數時最多保留 2 位小數', () => {
    expect(formatNumber(1234.567)).toBe('1,234.57')
    expect(formatNumber('1234.567')).toBe('1,234.57')
  })
})
