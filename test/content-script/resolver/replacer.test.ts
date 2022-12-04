/**
 * Copyright (c) 2022 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import Context from "@script/resolver/context"
import Replacer from "@script/resolver/replacer"

describe("test replacer", () => {
    test('test priority', () => {
        let replacer = new Replacer(
            [{
                origin: /种植/,
                mask: 'AAA'
            }, {
                origin: /种植体/,
                mask: 'BBB'
            }],
            new Context()
        )
        const originText = "种植体"
        let result = replacer.replaceStr(originText)

        expect(result).toEqual('AAA体')

        replacer = new Replacer(
            [{
                origin: /种植体/,
                mask: 'BBB'
            }, {
                origin: /种植/,
                mask: 'AAA'
            }],
            new Context()
        )
        result = replacer.replaceStr(originText)
        expect(result).toEqual('BBB')
    })
})