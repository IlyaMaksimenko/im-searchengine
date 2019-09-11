import { StringWord } from "./StringWord"

export function stringSearch(str: string, query: string, startIndex: number = 0): number {
    if (!str || !query) {
        return -1;
    }
    return str.toLowerCase().indexOf(query.toLowerCase(), startIndex);
}

export function getWordsOfString(str: string): StringWord[] {
    const result: StringWord[] = [];
    let startIndex = 0;
    let wordStarted = false;
    let word: string = "";
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        // words only splited by space character
        if (char === " ") {
            wordStarted = false;
            result.push({
                text: word,
                position: startIndex,
            });
            word = "";
        } else {
            if (!wordStarted) {
                startIndex = i;
            }
            wordStarted = true;
            word += char;
        }
    }
    if (word) {
        result.push({
            text: word,
            position: startIndex,
        });
    }

    return result;
}