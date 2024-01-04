import {
    Application, Builtin,
    IsApplication,
    IsBuiltin,
    IsLocalExtension,
    LocalExtension, newShortcut,
    SearchItem,
    SearchWrapper, setShortcut, Shortcut
} from "@/native";
import {shell} from "electron";
import React, {useEffect, useState} from "react";
import {useRecordHotkeys} from "react-hotkeys-hook";
import {IoCloseCircle} from "react-icons/io5";
import {Background, Container} from "launcher-api";

export function Render({currentItem}: { currentItem: SearchWrapper<SearchItem> | null }) {
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

function RenderApplication(app: SearchWrapper<Application>) {
    return <div>{app.item.name}
        <h1>TODO</h1>
    </div>
}

function RenderLocalExtension(app: SearchWrapper<LocalExtension>) {
    const [hotkey, setHotkey] = useState(app.item.shortcut)

    return (
        <Container>
            <Background>
                <div className='flex-row p-4 h-540px'>
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
                    <div className=''>
                        <div className='m-2'>
                            <div className='font-bold pb-1'>快捷键</div>
                            <HotkeyRecorder
                                value={hotkey}
                                onStop={() => {
                                    //@ts-ignore
                                    window.launcher.setShortcut(newShortcut(hotkey, app.item))
                                }}
                                onChange={setHotkey}
                            />
                        </div>
                    </div>
                </div>
            </Background>
        </Container>
    )
}

function RenderBuiltin(app: SearchWrapper<Builtin>) {
    return <div>{app.item.name}
        <h1>TODO</h1>
    </div>
}


// inspired by https://github.com/openai-translator/openai-translator/blob/a93506c0137d5e44b4ea50ebe7ee496463343dd1/src/common/components/Settings.tsx#L1114
function HotkeyRecorder({value, onChange, onStop}: {
    value?: string,
    onChange?: (value: string) => void
    onStop?: () => void
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotKeys, isRecording])

    useEffect(() => {
        const stopRecording = () => {
            if (isRecording) {
                stop()
                onStop?.()
            }
        }
        document.addEventListener('click', stopRecording)
        return () => {
            document.removeEventListener('click', stopRecording)
        }
    }, [isRecording, onStop, stop])

    function clearHotkey() {
        onChange?.('')
        setHotKeys([])
    }

    return (
        <div>
            <div
                className='h-32px p-[0,14px]
                 w-200px rounded-4px border-dashed border-transparent
                 bg-white/70 text-dark cursor-pointer'
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
            <div className='text-gray/80 text-sm pt-1'>
                {isRecording ? '请按您要设置的快捷键。' : '点击上面设置快捷键。'}
            </div>
        </div>
    )
}
