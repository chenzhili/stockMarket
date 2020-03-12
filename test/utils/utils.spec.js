import { splitNumber, browserRedirect, calValuePos } from "../../src/utils/index.js"

describe("src中的所有utils中的 方法测试", () => {
    describe("splitNumber test", () => {
        describe.each([[100, 100], [100000, "10万"], [1000000000, "10亿"], [2000000000000, "2万亿"], [160000000000000000, "16兆"], [null, "无效数据"]])(
            'params %i',
            (a, expected) => {
                test(`returns ${expected}`, () => {
                    expect(splitNumber(a)).toBe(expected);
                });
            },
        );
    })

    describe("browserRedirect test", () => {
        test("is pc or h5", () => {
            expect(browserRedirect()).toMatch(/^(pc|h5)$/)
        })
    })

    describe("calValuePos test", () => {
        const calValuePosData = {
            actuallyValue: ["20.00", "15.25", "10.50", "5.75", "1.00"],
            valueYPos: [100, 150, 200, 250, 300]
        };
        test("calValuePos split structure", () => {
            console.log('test', splitNumber.mock);
            expect(calValuePos({ min: 1, max: 20, totalHeight: 200, baseHeight: 100, n: 5 })).toEqual(calValuePosData)
        })
    })
})