import { SearchHit } from "../src/SearchHit";
import { StringChunk } from "../src/StringChunk";
import { SearchResult } from "../src/SearchResult";

interface BookSearchItem {
  id: string,
  name: string,  
  type: string,
}

describe("SearchResult", () => {
  const searchItem: BookSearchItem = {
    id: "123456",
    name: "Cat at the cathouse",
    type: "Fantasy"
  };

  it("getStringChunks", () => {
    const matches: Array<SearchHit<BookSearchItem>> = [
      { key: "name", position: 0, length: 3 },
      { key: "name", position: 11, length: 3 },
    ];
    const searchResult = new SearchResult(searchItem, matches, true);
    const expectedResult: StringChunk[] = [
      { text: "Cat", isBold: true },
      { text: " at the ", isBold: false },
      {
        text: "cat",
        isBold: true,
      },
      {
        text: "house",
        isBold: false,
      },
    ];
    expect(searchResult.getStringChunks("name")).toEqual(expectedResult);
  });

  it("getStringMultiwordChunks", () => {
    const matches: Array<SearchHit<BookSearchItem>> = [
      { key: "name", position: 0, length: 3 },
      { key: "name", position: 7, length: 3 },
      { key: "name", position: 11, length: 3 },
    ];
    const searchResult = new SearchResult(searchItem, matches, true);
    const expectedResult: StringChunk[] = [
      { text: "Cat", isBold: true },
      { text: " at ", isBold: false },
      { text: "the", isBold: true },
      { text: " ", isBold: false },
      { text: "cat", isBold: true },
      { text: "house", isBold: false },
    ];
    expect(searchResult.getStringChunks("name")).toEqual(expectedResult);
  });
});
