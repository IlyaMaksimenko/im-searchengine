import { SearchResult } from "./SearchResult";
import { SearchHit } from "./SearchHit";
import { orderBy } from "./Sorter";
import { getWordsOfString, stringSearch } from "./SearchUtils";

export class Search<T> {
    public items: T[];
    public searchFields: Map<keyof T, (item: T) => boolean>;

    constructor(items: T[], searchFields: Map<keyof T, (item: T) => boolean>) {
        this.items = items;
        this.searchFields = searchFields;
    }

    public doSearch(query: string): Array<SearchResult<T>> {
        const matchedItems = this.items.map(item => this.toSearchResult(item, query)).filter(s => s.matched);

        return orderBy(matchedItems, i => {
            const nameMatch = i.matches.find(m => m.key === "name");
            return {
                value: nameMatch ? nameMatch.position : Infinity,
                descending: false,
            };
        });
    }

    private toSearchResult(item: T, query: string) {
        const matches = this.match(item, query);
        const matched = Object.values(matches).some(h => !!h && h.position >= 0);
        return new SearchResult(item, matches, matched);
    }

    private match(item: T, query: string): Array<SearchHit<T>> {
        const result: Array<SearchHit<T>> = [];

        if (!this.searchFields) {
            return result;
        }

        this.searchFields.forEach((value, key, _map) => {
            if (!value || value(item)) {
                result.push(...this.getKeyMatches(item, query, key));
            }
        });

        return result;
    }

    private getKeyMatches(item: T, query: string, key: keyof T): Array<SearchHit<T>> {
        const result: Array<SearchHit<T>> = [];

        const str = item[key];
        if (typeof str === "string") {
            const trimedQuery = query.trim();
            if (stringSearch(trimedQuery, " ") >= 0) {
                return this.getMultiwordSearchHits(str, trimedQuery, key);
            } else {
                return this.getStringSearchHits(str, trimedQuery, key);
            }
        }

        return result;
    }

    private getStringSearchHits(str: string, query: string, key: keyof T): Array<SearchHit<T>> {
        const result: Array<SearchHit<T>> = [];
        let index: number = 0;
        let offset: number = 0;
        do {
            index = stringSearch(str, query, offset);
            if (index >= 0) {
                result.push({
                    key,
                    position: index,
                    length: query.length,
                });
                offset = index + query.length;
            }
        } while (index >= 0);

        return result;
    }

    private getWordSearchHits(str: string, queryWord: string, key: keyof T): Array<SearchHit<T>> {
        const sourceWords = getWordsOfString(str);

        const findWords = sourceWords.filter(w => w.text.toLowerCase().startsWith(queryWord.toLowerCase()));

        return findWords.map(w => ({
            key,
            position: w.position,
            length: queryWord.length,
        }));
    }

    private getMultiwordSearchHits(str: string, query: string, key: keyof T): Array<SearchHit<T>> {
        const result: Array<SearchHit<T>> = [];
        const words = new Set(
            query
                .trim()
                .split(" ")
                .filter(x => x)
        );

        for (const word of words) {
            const wordSearchHits = this.getWordSearchHits(str, word, key);
            if (wordSearchHits.length === 0) {
                return [];
            }

            result.push(...wordSearchHits);
        }
        return result.sort((a, b) => a.position - b.position);
    }
}