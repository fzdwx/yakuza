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
    git_url: string
}


export interface LocalExtension extends RemoteExtension {
    fullPath: string
    dirName: string
}

export interface RemoteExtensionResp extends RemoteExtension {
    installed: boolean
    fullPath: string
}

export interface SearchResp<T> {
    score: number
    item: T
    kind:string
}

export const IsApplication = (obj: SearchResp<SearchItem>): obj is SearchResp<Application> => {
    return obj.kind === 'Application'
}

export const IsLocalExtension = (obj: SearchResp<SearchItem>): obj is SearchResp<LocalExtension> => {
    return obj.kind === 'Extension'
}

export type SearchItem = LocalExtension | Application
