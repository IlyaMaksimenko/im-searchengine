interface Sorter {
    value: any;
    descending?: boolean;
}

interface SorterNormalized {
    value1: any;
    value2: any;
    descending: boolean;
}

type SortingArg = Sorter | Date | number | string;
type SortingFn<T> = (item: T) => SortingArg;

export function orderByDescending<T>(items: T[], func: SortingFn<T>) {
    return orderBy(items, item => ({ value: func(item), descending: true }));
}

export function orderBy<T>(items: T[], ...funcs: Array<SortingFn<T>>) {
    return items.sort((a, b) => {
        let result = 0;
        for (const func of funcs) {
            const { value1, value2, descending } = normalizeSortingArgument(func, a, b);
            result = order(value1, value2, descending);
            if (result !== 0) break;
        }
        return result;
    });
}
function normalizeSortingArgument<T>(func: SortingFn<T>, a: T, b: T): SorterNormalized {
    const first = func(a);
    const second = func(b);
    let descending: boolean = false;
    let value1;
    let value2;
    if (isSortingObject(first) && isSortingObject(second)) {
        descending = first.descending || false;
        value1 = first.value;
        value2 = second.value;
    } else {
        value1 = first;
        value2 = second;
    }
    return { value1, value2, descending };
}

function isSortingObject(arg: SortingArg): arg is Sorter {
    return typeof arg === "object" && !(arg instanceof Date);
}

export function order(first: any, second: any, isDescending = false) {
    if (isDescending) {
        [first, second] = [second, first];
    }

    // Check if both are numbers
    if (!isNaN(first) && !isNaN(second)) {
        return first - second;
    }

    // Check if both cannot be evaluated
    if (first === null && second === null) {
        return 0;
    }

    [first, second] = [first, second].map(s => (s || "").toString().toLocaleLowerCase());

    if (first > second) return 1;
    if (first < second) return -1;

    return 0;
}