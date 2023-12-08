import {addAppRunCount, Application, getApplications, getIcon, getLocalExtensions} from "@/native"
import {Command} from "launcher-api"
import React, {useEffect, useState} from "react"
import {useInterval} from "ahooks";

const useApplications = (searchText:string) => {
    const [loading, setLoading] = useState(true)
    const [apps, setApps] = useState<Application[]>([])

    const get = async (searchText:string) => {
        setLoading(true)
        const app = await getApplications(searchText)
        setApps(app)
        setLoading(false)
    }
    useEffect(() => {
        get(searchText)
    }, [searchText])

    return {
        apps,
        loading
    }
}

const AppImage = ({app}: { app: Application }) => {
    const image = getIcon(app)
    if (image) {
        return (<>
            <img alt="icon" className="w-4" src={image}/>
        </>)
    }
    return (
        <></>
    )
}
const runApplication = (app: Application) => {
    const command = app.exec
        .replace("%u", "").replace("%U", "")
        .replace("%f", "").replace("%F", "")
    window.launcher.execCommand(command)
    window.launcher.hide()
    addAppRunCount(app)
}

const application = (props: { searchText: string }) => {
    const {apps, loading} = useApplications(props.searchText)
    return (
        <>
            <Command.Group heading="Applications">
                {apps.map((item) => (
                    <Command.Item
                        key={item.name}
                        value={item.name}
                        data-value={item.count}
                        onSelect={() => {
                            runApplication(item)
                        }}
                    >
                        <AppImage app={item}/>
                        {item.name}
                    </Command.Item>
                ))}
            </Command.Group>
        </>
    )
}

export default application
