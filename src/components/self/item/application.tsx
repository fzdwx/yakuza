import {addAppRunCount, Application, execCommand, getApplications, getIcon} from "@/native"
import React, {useEffect, useMemo, useState} from "react"
import {Action, useRegisterActions} from "@/lib/kbar";

export const useRegisterApps = () => {
    const [apps, setApps] = useState<Application[]>([])
    const actions = useMemo(() => {
        return apps?.map(
            (app): Action => ({
                id: `app-${app.name}`,
                name: app.name ?? '',
                item: app,
                perform: () => {
                    runApplication(app)
                },
                icon: <AppImage app={app}/>
            }),
        );
    }, [apps]);

    useRegisterActions(actions, [actions]);

    useEffect(() => {
        getApplications().then(e => {
            setApps(e)
        })
    }, [])
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
    const commands = app.exec
        .replace("%u", "").replace("%U", "")
        .replace("%f", "").replace("%F", "")
        .trim()
        .split(" ")

    execCommand(commands[0], commands.slice(1), app.terminal)
    window.launcher.hide()
    addAppRunCount(app)
}