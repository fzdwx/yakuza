const set = async (key: string, value: string) => {
    return window.launcher.set(key, value)
}

const get = async (key: string): Promise<string> => {
    return window.launcher.get(key)
}

export {get, set}
