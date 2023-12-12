import {SearchResp} from "@/native/types";

const getBuiltin = async (searchText: string) => {
    const resp = await fetch(`http://localhost:35677/api/builtin?searchText=${searchText}`)
    return await resp.json() as SearchResp<string>[]
};


export {getBuiltin}
