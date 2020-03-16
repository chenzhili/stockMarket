let ctx = null;
beforeAll(() => {
    ctx = document.createElement('canvas').getContext('2d');
})
it('patinCom canvas mock', () => {
    expect(() => ctx.arc(1, 2, 3, 4)).toThrow(TypeError);
})