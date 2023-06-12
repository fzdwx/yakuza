import { customRef } from 'vue'

export function useDebouncedRef<T>(value :T, delay = 200) {
    // @ts-ignore
    let timeout
    return customRef((track, trigger) => {
        return {
            get() {
                track()
                return value
            },
            set(newValue) {
                // @ts-ignore
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                    value = newValue
                    trigger()
                }, delay)
            }
        }
    })
}
