import { paintLine } from '../../src/utils/paintCom'

let ctx = null;
beforeEach(() => {
    ctx = document.createElement('canvas').getContext('2d');
})
it('patinCom canvas mock', () => {
    // console.log(ctx);
    expect(() => ctx.arc(1, 2, 3, 4)).toThrow(TypeError);
})
describe('测试 canvas的 返回 对应的 snapshot', () => {
    let calls;
    console.log(ctx)
    describe.each`
        sx    | sy      | ex    | ey
        ${0}  |  ${0}   | ${0}  | ${0}
        ${0}  |  ${-1}  | ${-2} | ${0}
        ${0}  |  ${null}| ${0}  | ${100}
    `('参数值 sx:$sx sy:$sy ex:$ex ey:$ey', ({ sx, sy, ex, ey }) => {
        paintLine({ ctx, sx, sy, ex, ey });
        calls = ctx.__getDrawCalls();
        expect(path).toMatchSnapshot();
    })
})
