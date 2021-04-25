import { matchScope } from "../../src/common/matcher"
import MockStorage from "../mock/storage"


chrome.storage.local = new MockStorage()

test('testScopeMatch', () => {
    expect(
        matchScope({ pattern: '.*', type: 'host' }, 'www.douban.com', '')
    ).toBeTruthy()

    expect(
        matchScope({ pattern: 'www\..*\.com', type: 'url' }, 'www.douban.com', '')
    ).toBeFalsy()

    expect(() => matchScope({ pattern: '*JKJ', type: 'host' }, '', '')).toThrow(SyntaxError)
})