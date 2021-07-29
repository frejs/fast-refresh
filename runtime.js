import { getCurrentFiber, schedule } from 'fre'

let graph = new Map()
let queue = new Set()

export function register(type, name) {
    const ref = graph.get(type)
    if (!ref) {
        graph.set(type, { n: name, f: null })
    }
}

export function sign() {
    return (type, key) => { // fn => key
        const ref = graph.get(type)
        const fiber = getCurrentFiber()
        if (ref) {
            ref.f = fiber
            ref.k = key
        }
        queue.add(ref)
    }
}

export function refresh() {
    queue.forEach(ref => schedule(ref.f))
    queue.size = 0
}