import {Application as AppType, IsApplication, IsBuiltin, IsLocalExtension, SearchItem, SearchResp} from "@/native";
import React from "react";
import ApplicationItem from "@/components/self/applicationItem";
import LocalExtensionItem from "@/components/self/localExtension";
import Builtin from "@/components/self/builtin";
import {useCommandState} from "launcher-api";

const RenderItem = (props: { item: SearchResp<SearchItem> }) => {
    if (IsApplication(props.item)) {
        return <ApplicationItem item={props.item}/>
    }

    if (IsLocalExtension(props.item)) {
        return <LocalExtensionItem item={props.item}/>
    }

    if (IsBuiltin(props.item)) {
        return <Builtin item={props.item}/>
    }
    return (
        <div></div>
    )
}


export default RenderItem
