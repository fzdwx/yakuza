export interface Application {
    name: string;
    exec: string;
    terminal: boolean;
    type: string;
    icon: string;
    count: number;
}

export interface RemoteExtension {
    name: string
    description: string
    author: string
    icon: string
    github: string
}

export interface RemoteAction {
    name: string
    command: string
}

export interface LocalExtension extends RemoteExtension {
    fullPath: string
    dirName: string
    shortcut: string
    action?: RemoteAction
}

export interface RemoteExtensionResp extends RemoteExtension {
    installed: boolean
    fullPath: string
}

export type kind = "Application" | "Extension" | "Builtin"

export interface SearchWrapper<T> {
    item: T
    kind: kind
}

export interface Shortcut {
    kind: kind
    shortcut: string
    name: string
    item: SearchItem
}

export const newShortcut = (shortcut: string, item: LocalExtension) => {
    return {
        kind: 'Extension',
        shortcut: shortcut,
        name: `${item.author}-${item.name}`,
        item: item
    } as Shortcut
}

export const IsApplication = (obj: SearchWrapper<SearchItem>): obj is SearchWrapper<Application> => {
    return obj.kind === 'Application'
}

export const IsLocalExtension = (obj: SearchWrapper<SearchItem>): obj is SearchWrapper<LocalExtension> => {
    return obj.kind === 'Extension'
}

export const IsBuiltin = (obj: SearchWrapper<SearchItem>): obj is SearchWrapper<Builtin> => {
    return obj.kind === 'Builtin'
}

export type Builtin = {
    name: string
}

export type SearchItem = LocalExtension | Application | Builtin
