import { paintLine } from '../../src/utils/paintCom'

/*
    对于 canvas 的 snapshot 测试 时的 jest-canvas-mock 插件的三个用法
    1、这个方法是 用于 生成 有关于 functions 和 properties 用到了哪些的方法 快照
        ctx.__getEvents();
    2、证明当前 绘制的 路径 是否与 当前上下文 相关的 快照
        ctx.__getPath();
    3、所有绘制 成功的 都会提交都 上下中 生成快照
        ctx.__getDrawCalls();
*/
let ctx = null
beforeEach(() => {
  ctx = document.createElement('canvas').getContext('2d')
})
it('patinCom canvas mock', () => {
  expect(() => ctx.arc(1, 2, 3, 4)).toThrow(TypeError)
})
describe('测试 canvas的 返回 对应的 snapshot', () => {
  let calls
  describe.each`
        sx    | sy      | ex    | ey
        ${0}  |  ${0}   | ${0}  | ${0}
        ${0}  |  ${-1}  | ${-2} | ${0}
        ${0}  |  ${null}| ${0}  | ${100}
        ${''} |  ${''}  | ${''}  | ${''}
        ${undefined} |  ${undefined}  | ${undefined}  | ${undefined}
    `('测试paintLine 函数 sx:$sx sy:$sy ex:$ex ey:$ey', ({ sx, sy, ex, ey }) => {
    it('测试 canvas 绘制是否顺利', () => {
      paintLine({ ctx, sx, sy, ex, ey })
      // calls = ctx.__getEvents();
      calls = ctx.__getDrawCalls()
      expect(calls).toMatchSnapshot()
    })
  })
})
