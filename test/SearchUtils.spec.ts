import { getWordsOfString, stringSearch } from "../src/SearchUtils";
import { StringWord } from "../src/StringWord"

describe("SearchUtils", () => {
    it("stringSearch", () => {
        expect(stringSearch("hello world", "world")).toBe(6);
    });

    it("getWordsOfString", () => {
        const expectedResult: StringWord[] = [{ text: "hello", position: 0 }, { text: "world", position: 6 }];
        expect(getWordsOfString("hello world")).toEqual(expectedResult);
    });
});
