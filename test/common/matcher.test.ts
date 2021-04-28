import { matchScope } from "../../src/common/matcher"


test('testScopeMatch', () => {
    expect(
        matchScope({ pattern: '.*', type: 'host', useReg: true }, 'www.douban.com', '')
    ).toBeTruthy()

    expect(
        matchScope({ pattern: 'www\..*\.com', type: 'url', useReg: true }, 'www.douban.com', '')
    ).toBeFalsy()

    expect(() => matchScope({ pattern: '*JKJ', type: 'host', useReg: true }, '', '')).toThrow(SyntaxError)
})