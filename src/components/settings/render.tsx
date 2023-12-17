import {
    Application, Builtin,
    IsApplication,
    IsBuiltin,
    IsLocalExtension,
    LocalExtension, newShortcut,
    SearchItem,
    SearchResp, setShortcut, Shortcut
} from "@/native";
import {shell} from "electron";
import React, {useEffect, useState} from "react";
import {useRecordHotkeys} from "react-hotkeys-hook";
import {IoCloseCircle} from "react-icons/io5";

export function Render({currentItem}: { currentItem: SearchResp<SearchItem> | null }) {
    if (currentItem == null) {
        return <div>
            Not found
        </div>
    }

    if (IsApplication(currentItem)) {
        return RenderApplication(currentItem)
    }
    if (IsLocalExtension(currentItem)) {
        return RenderLocalExtension(currentItem)
    }
    if (IsBuiltin(currentItem)) {
        return RenderBuiltin(currentItem)
    }
    return <div>
        Not found
    </div>
}

function RenderApplication(app: SearchResp<Application>) {
    return <div>{app.item.name}
        <h1>TODO</h1>
    </div>
}

function RenderLocalExtension(app: SearchResp<LocalExtension>) {
    const [hotkey, setHotkey] = useState(app.item.hotkey)

    return <div className='flex-row p-2 h-540px'>
        <div className='flex cursor-default'>
            <img className='w-10 h-10' src={app.item.icon} alt='icon'></img>
            <h1 className='ml-4'>{app.item.name}</h1>
            <div className='pt-4 pl-2'>
                <span className='pr-2 text-white/60'>by</span>
                <span>{app.item.author}</span>
                <span className='pl-2'>|</span>
                <span className='pl-2 text-#10b981 cursor-pointer' onClick={() => {
                    shell.openExternal(app.item.github)
                }}>Open in Github</span>
            </div>
        </div>
        <div>
            <HotkeyRecorder
                value={hotkey}
                onBlur={() => {
                    if (hotkey.length > 0 && hotkey !== app.item.hotkey) {
                        //@ts-ignore
                        window.launcher.setShortcut(newShortcut(hotkey, app.item))
                    }
                }}
                onChange={setHotkey}/>
        </div>

    </div>
}

function RenderBuiltin(app: SearchResp<Builtin>) {
    return <div>{app.item.name}
        <h1>TODO</h1>
    </div>
}


// inspired by https://github.com/openai-translator/openai-translator/blob/a93506c0137d5e44b4ea50ebe7ee496463343dd1/src/common/components/Settings.tsx#L1114
function HotkeyRecorder({value, onChange, onBlur}: {
    value?: string,
    onBlur?: () => void,
    onChange?: (value: string) => void
}) {
    const [keys, {start, stop, isRecording}] = useRecordHotkeys()

    const [hotKeys, setHotKeys] = useState<string[]>([])
    useEffect(() => {
        if (value) {
            setHotKeys(
                value
                    .replace(/-/g, '+')
                    .split('+')
                    .map((k) => k.trim())
                    .filter(Boolean)
            )
        }
    }, [value])

    useEffect(() => {
        let keys_ = Array.from(keys)
        if (keys_ && keys_.length > 0) {
            keys_ = keys_.map((k) => (k.toLowerCase() === 'meta' ? 'CommandOrControl' : k))
            setHotKeys(keys_)
            onChange?.(keys_.join('+'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keys])

    useEffect(() => {
        if (!isRecording) {
            onChange?.(hotKeys.join('+'))
            onBlur?.()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotKeys, isRecording])

    useEffect(() => {
        const stopRecording = () => {
            if (isRecording) {
                stop()
            }
        }
        document.addEventListener('click', stopRecording)
        return () => {
            document.removeEventListener('click', stopRecording)
        }
    }, [isRecording, onBlur, stop])

    function clearHotkey() {
        onChange?.('')
        setHotKeys([])
    }

    return (
        <div>
            <div
                className='h-32px p-[0,14px]
                 w-200px rounded-4px border-dashed border-transparent
                 bg-white text-dark cursor-pointer'
                onClick={(e) => {
                    e.stopPropagation()
                    e.currentTarget.focus()
                    if (!isRecording) {
                        start()
                    } else {
                        stop()
                    }
                }}
            >
                {hotKeys.join(' + ')}
                {!isRecording && hotKeys.length > 0 ? (
                    <IoCloseCircle
                        onClick={(e: React.MouseEvent<SVGElement>) => {
                            e.stopPropagation()
                            clearHotkey()
                        }}
                    />
                ) : null}
            </div>
            <div className=''>
                {isRecording ? '请按您要设置的快捷键。' : '点击上面设置快捷键。'}
            </div>
        </div>
    )
}
