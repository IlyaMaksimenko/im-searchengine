
export interface SearchHit<T> {
    key: keyof T;
    position: number;
    length: number;
}