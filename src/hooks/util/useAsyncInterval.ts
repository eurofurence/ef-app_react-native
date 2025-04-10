import { DependencyList, useEffect } from 'react'

export const useAsyncInterval = (fn: (args: { go: boolean }) => Promise<void>, deps: DependencyList, interval: number, immediately = true) => {
    useEffect(() => {
        const args = { go: true }
        let active = false

        const wrapper = () => fn(args)

        active = false
        if (immediately) {
            active = true
            wrapper().finally(() => {
                active = false
            })
        }

        const handle = setInterval(() => {
            if (active) return
            active = true
            wrapper().finally(() => {
                active = false
            })
        }, interval)

        return () => {
            args.go = false
            clearInterval(handle)
        }
    }, deps)
}
