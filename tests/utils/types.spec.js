import { type } from '../../src/utils/types'

describe('测试src/utils/types module的 方法', () => {
  describe('type类型检测测试', () => {
    describe.each`
        value           |   expected
        ${100}          |       ${'number'}
        ${{}}           |       ${'object'} 
        ${[]}           |       ${'array'}  
        ${null}         |       ${'null'}  
        ${undefined}    |       ${'undefined'}  
        ${''}           |       ${'string'}  
        `(('参数 $value'), ({ value, expected }) => {
      test(`return ${expected}`, () => {
        expect(type(value)).toBe(expected)
      })
    })
  })
})
