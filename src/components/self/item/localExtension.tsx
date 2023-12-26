import {Command} from "launcher-api";
import {useEffect, useState} from "react";
import {Application, getLocalExtensions, LocalExtension} from "@/native";
import {SearchResp} from "@/native/types";
import {useViewEvent} from "@/hooks/useView";
import {useHover} from "@/components/self/hooks";

const useLocalExtensions = () => {
     return  getLocalExtensions()
}

const {changeView} = useViewEvent()

const {change} = useHover()
const LocalExtensionItem = ({item}: { item: SearchResp<LocalExtension> }) => {
    return (<Command.Item
        value={item.item.name}
        data-value={item.item.name}
        key={item.id}
        launcher-id={item.id}
        onHover={() => {
            change(item)
        }}
        onSelect={() => {
            // @ts-ignore
            window.launcher.openExtension(item.item)
            changeView('extView')
        }}
    >
        <img className="w-4" alt='img' src={item.item.icon}/>
        <span className="">{item.item.name}</span>
        <span className="absolute right-2 text-gray/80">{item.kind}</span>
    </Command.Item>)
}

export {useLocalExtensions}

export default LocalExtensionItem
