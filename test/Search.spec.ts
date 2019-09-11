import { Search } from "../src/Search";

interface BookSearchItem {
  id: string,
  name: string,
  type: string,
}

describe("Search", () => {
  let search: Search<BookSearchItem> = new Search<BookSearchItem>([], new Map());

  beforeAll(() => {
    const items: BookSearchItem[] = [
      {
        id: "asf2awdf",
        name:
          "Header Test New Book2 Header Test New Book2Header Test New Book2 Header Test New Book2",
        type: "Thriller"
      },
      {
        id: "asdf24dfa",
        name: "Cat at the cathouse",
        type: "Fantasy"
      },
      {
        id: "d90b3b30-c9bf-4408-9ca0-1a6b43668516",
        name: "Test2",
        type: "Art"
      },
      {
        id: "asdf22d",
        name: "Dog at the hous",
        type: "Thriller"
      },
    ];

    const searchFields = new Map<keyof BookSearchItem, (item: BookSearchItem) => boolean>([
      ["name", () => true],
      ["id", (item: BookSearchItem) => item.type === "Fantasy"],
    ]);

    search = new Search(items, searchFields);
  });

  it("searchByChar", () => {
    expect(search.doSearch("t").length).toBe(4);
  });

  it("searchByPart", () => {
    expect(search.doSearch("test").length).toBe(2);
  });

  it("searchByMultipleWords", () => {
    expect(search.doSearch("the cat").length).toBe(1);
  });

  it("searchWithNoResults", () => {
    expect(search.doSearch("123456").length).toBe(0);
  });
});
