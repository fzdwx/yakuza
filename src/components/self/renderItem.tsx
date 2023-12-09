import {Application as AppType, IsApplication, IsLocalExtension, SearchItem, SearchResp} from "@/native";
import React from "react";
import ApplicationItem from "@/components/self/applicationItem";
import LocalExtensionItem from "@/components/self/localExtension";

const RenderItem = (props: { item: SearchResp<SearchItem> }) => {
    if (IsApplication(props.item)) {
        return <ApplicationItem item={props.item}/>
    }

    if (IsLocalExtension(props.item)) {
        return <LocalExtensionItem item={props.item}/>
    }

    return (
        <div></div>
    )
}


export default RenderItem
