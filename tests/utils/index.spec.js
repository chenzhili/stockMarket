import { splitNumber, browserRedirect, calValuePos, getDecimalValue, formatNumber } from '../../src/utils/index.js'

describe('src中的所有utils中的 方法测试', () => {
  describe('splitNumber test', () => {
    describe.each([[100, 100], [100000, '10万'], [1000000000, '10亿'], [2000000000000, '2万亿'], [160000000000000000, '16兆'], [null, '无效数据']])(
      'params %i',
      (a, expected) => {
        it(`returns ${expected}`, () => {
          expect(splitNumber(a)).toBe(expected)
        })
      }
    )
  })

  describe('browserRedirect test', () => {
    it('is pc or h5', () => {
      expect(browserRedirect()).toMatch(/^(pc|h5)$/)
    })
  })

  describe('calValuePos test', () => {
    const calValuePosData = {
      actuallyValue: ['20.00', '15.25', '10.50', '5.75', '1.00'],
      valueYPos: [100, 150, 200, 250, 300]
    }
    it('calValuePos split structure', () => {
      // console.log('test', splitNumber.mock)
      expect(calValuePos({ min: 1, max: 20, totalHeight: 200, baseHeight: 100, n: 5 })).toEqual(calValuePosData)
    })
  })

  describe('getDecimalValue test', () => {
    const testData = [
      [230.1123, 10000],
      [230.13, 100],
      [230, 0]
    ]
    describe.each(testData)(('params %i'), (integar, expected) => {
      it(`return ${expected}`, () => {
        expect(getDecimalValue(integar)).toBe(expected)
      })
    })
  })

  describe('formatNumber test', () => {
    describe.each`
        num          |   dec     |   expected
        ${100.1}     | ${100}    | ${'100.10'}
        ${230.133434}| ${1000}   | ${'230.133'}
        ${230}       | ${0}      | ${'230'}
        `(('params $num $dec'), ({ num, dec, expected }) => {
      test(`return ${expected}`, () => {
        expect(formatNumber(num, dec)).toBe(expected)
      })
    })
  })
})
