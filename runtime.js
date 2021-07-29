import { getCurrentFiber, schedule } from 'fre'

let graph = new Map()
let queue = new Set()

export function register(type, id) {
    graph.set(type, id) // fn => name
}

export function sign() {
    return (type, key) => { // fn => key
        const current = getCurrentFiber()
        queue.add(current)
    }
}

export function refresh() {
    queue.some(c => schedule(c))
}