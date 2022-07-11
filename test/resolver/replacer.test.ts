/**
 * Copyright (c) 2022 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import replacer from "@resolver/replacer"

describe("test replacer", () => {
    test('test priority', () => {
        const originText = "种植体"
        let result = replacer.replaceWithWords(originText, [{
            origin: /种植/,
            mask: 'AAA'
        }, {
            origin: /种植体/,
            mask: 'BBB'
        }])

        expect(result).toEqual('AAA体')

        result = replacer.replaceWithWords(originText, [{
            origin: /种植体/,
            mask: 'BBB'
        }, {
            origin: /种植/,
            mask: 'AAA'
        }])
        expect(result).toEqual('BBB')
    })
})