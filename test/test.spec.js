const binaryStringToNumber = binString => {
    if (!/^[01]+$/.test(binString)) {
        throw new Error('Not a binary number.');
    }

    return parseInt(binString, 2);
};

describe('binaryStringToNumber', () => {
    describe('given an invalid binary string', () => {
        test('composed of non-numbers throws CustomError', () => {
            expect(() => binaryStringToNumber('abc')).toThrowError(Error);
        });

        test('with extra whitespace throws CustomError', () => {
            expect(() => binaryStringToNumber('  100')).toThrowError(Error);
        });
    });

    describe('given a valid binary string', () => {
        test('returns the correct number', () => {
            expect(binaryStringToNumber('100')).toBe(4);
        });
    });
});

describe.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
    '.add(%i, %j)',
    (a, b, expected) => {
        test(`returns ${expected}`, () => {
            expect(a + b).toBe(expected);
        });

        test(`returned value not be greater than ${expected}`, () => {
            expect(a + b).not.toBeGreaterThan(expected);
        });

        test(`returned value not be less than ${expected}`, () => {
            expect(a + b).not.toBeLessThan(expected);
        });
    },
);