/* 获取对应的 仓库信息 */
// import test from '../src/utils/test'
const { getChangedFilesForRoots } = require('jest-changed-files') // 检出 仓库的变化
const diff = require('jest-diff') // 比较任何类型的 数据 的区别，深比较
const getType = require('jest-get-type') // 识别当前的 数据类型
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import VueTest from '../src/vueCom/VueTest.vue'

const a = { a: 1, b: 2, c: { d: 2 } }
const b = { a: 1, b: 2, c: { e: 2 } }
// console.log(diff(a, b))

const binaryStringToNumber = binString => {
  if (!/^[01]+$/.test(binString)) {
    throw new Error('Not a binary number.')
  }

  return parseInt(binString, 2)
}

describe('binaryStringToNumber', () => {
  describe('given an invalid binary string', () => {
    test('composed of non-numbers throws CustomError', async () => {
      // 打印出当前目录最后修改过的一组文件
      const result = await getChangedFilesForRoots(['./'], {
        withAncestor: true,
        lastCommit: true
      })
      // console.log(result);
      expect(() => binaryStringToNumber('abc')).toThrowError(Error)
    })

    test('with extra whitespace throws CustomError', () => {
      expect(() => binaryStringToNumber('  100')).toThrowError(Error)
    })
  })

  describe('given a valid binary string', () => {
    test('returns the correct number', () => {
      expect(binaryStringToNumber('100')).toBe(4)
    })
  })
})

describe.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %j)',
  (a, b, expected) => {
    test(`returns ${expected}`, () => {
      expect(a + b).toBe(expected)
    })

    test(`returned value not be greater than ${expected}`, () => {
      expect(a + b).not.toBeGreaterThan(expected)
    })

    test(`returned value not be less than ${expected}`, () => {
      expect(a + b).not.toBeLessThan(expected)
    })
  }
)

describe('测试 it 和 test的区别', () => {
  it('return test', () => {
    expect(1).toBe(1)
  })
})

function getDefault (a = 1) {
  return a
}
test('测试 function的默认参数', () => {
  expect(getDefault()).toBe(1)
})

// jest.mock('../src/utils/test', () => {
//   return jest.fn(() => { return 1223 })
// })
let Wrapper
beforeEach(() => {
  Wrapper = shallowMount(VueTest)
})
it('测试模块模拟', () => {
  // console.log(test())
  // expect(test()).toBeUndefined();
  // expect(test()).toBe(1223)
  expect(1).toBe(1)
})
