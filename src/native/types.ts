import {nanoid} from "nanoid";

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


export interface LocalExtension extends RemoteExtension {
    fullPath: string
    dirName: string
    hotkey: string
}

export interface RemoteExtensionResp extends RemoteExtension {
    installed: boolean
    fullPath: string
}

export interface SearchResp<T> {
    score?: number
    item: T
    kind: string
    id: string
    count: number,
}

export function extToResp(extensions: LocalExtension[]) {
    return extensions.map(
        ext => {
            return {
                item: ext,
                kind: 'Extension',
                count: 0
            } as SearchResp<SearchItem>
        }
    );
}

export function appsToResp(apps: Application[]) {
    return apps.map(
        a => {
            return {
                item: a,
                kind: 'Application',
                count: a.count,
            } as SearchResp<SearchItem>
        }
    );
}

export function builtinToResp(bs: string[]) {
    return bs.map(
        b => {
            return {
                item: {
                    name: b
                } as Builtin,
                kind: 'Builtin',
                count: 0,
            } as SearchResp<SearchItem>
        }
    );
}

export const IsApplication = (obj: SearchResp<SearchItem>): obj is SearchResp<Application> => {
    return obj.kind === 'Application'
}

export const IsLocalExtension = (obj: SearchResp<SearchItem>): obj is SearchResp<LocalExtension> => {
    return obj.kind === 'Extension'
}

export const IsBuiltin = (obj: SearchResp<SearchItem>): obj is SearchResp<Builtin> => {
    return obj.kind === 'Builtin'
}

export type Builtin = {
    name: string
}

export type SearchItem = LocalExtension | Application | Builtin
