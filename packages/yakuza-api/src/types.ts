export interface LauncherApi {
    hello(): Promise<string>

    execCommand(command: string, args?: Array<string>, terminal?: boolean, stdin?: string): Promise<string>

    spawn(command: string, args?: Array<string>): Promise<string>

    getPath(name: 'home' | 'appData' | 'userData' | 'sessionData' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps'): Promise<string>

    getSelect(): Promise<string>

    getClipText(): Promise<string>

    setClipText(text: string): void

    openUrl(url: string): Promise<void>

    openPath(path: string): Promise<void>

    hide(): void

    show(): void

    set<T>(key: string, value: T): Promise<void>

    get<T>(key: string): Promise<T>

    loadMainView(): void

    executeJs(js: string): Promise<any>
}
