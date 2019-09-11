import { SearchHit } from "./SearchHit";
import { StringChunk } from "./StringChunk";

export class SearchResult<T> {
    public item: T;
    public matches: Array<SearchHit<T>>;
    public matched: boolean;

    constructor(item: T, matches: Array<SearchHit<T>>, matched: boolean) {
        this.item = item;
        this.matches = matches;
        this.matched = matched;
    }

    // get string chunks of search result by key
    public getStringChunks(key: keyof T): StringChunk[] | undefined {
        const str = this.item[key];
        if (typeof str !== "string") {
            return undefined;
        }

        const chunks: StringChunk[] = [];
        let index: number = 0;
        const keyMatches = this.mergeMatches(key);
        for (const keyMatch of keyMatches) {
            if (index !== keyMatch.position) {
                chunks.push({
                    text: str.slice(index, keyMatch.position),
                    isBold: false,
                });
            }
            index = keyMatch.position + keyMatch.length;
            chunks.push({
                text: str.slice(keyMatch.position, index),
                isBold: true,
            });
        }
        if (index !== str.length) {
            chunks.push({
                text: str.slice(index, str.length),
                isBold: false,
            });
        }
        return chunks;
    }

    // merge matches by key using match position
    private mergeMatches(key: keyof T): Array<SearchHit<T>> {
        const matches = this.matches.filter(m => m.key === key && m.position >= 0);
        const result: Array<SearchHit<T>> = [];
        let lastIndex = 0;

        const sortedMatches = matches.sort((a, b) => a.position - b.position);
        for (const hit of sortedMatches) {
            if (hit.position >= lastIndex) {
                result.push(hit);
                lastIndex = hit.position + hit.length;
            } else {
                if (hit.position + hit.length >= lastIndex) {
                    const hitIndex = result.findIndex(r => r.position >= hit.position && r.position + r.length >= hit.position);
                    if (hitIndex >= 0) {
                        const searchHit = result[hitIndex];
                        const newHit = { ...searchHit, length: hit.position + hit.length - searchHit.position };
                        result.splice(hitIndex, 1);
                        result.push(newHit);
                        lastIndex = newHit.position + newHit.length;
                    }
                }
            }
        }

        return result;
    }
}
