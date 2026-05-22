import {LRUCache} from "lru-cache";

const results = new LRUCache<string, number>({max: 10})

export function isDayOfWeek(date: string, dayOfWeek: number) {
    let result = results.get(date)
    if (result === undefined) {
        result = new Date(date).getDay()
        results.set(date, result)
    }
    return result === dayOfWeek;
}