import {atom, useAtomValue, useStore} from "jotai";
import * as Popover from '@radix-ui/react-popover'
import React from "react";

const valAtom = atom("13123123")
const visAtom = atom(true)
const SetShortcutModel = () => {
    const val = useAtomValue(valAtom);
    const vis = useAtomValue(visAtom);

    // if (vis)
    //     return (
    //         <Popover.Root modal open={vis}>
    //             <Popover.Trigger asChild={false}>
    //                 <button className="IconButton" aria-label="Update dimensions">
    //                     123123asd
    //                 </button>
    //             </Popover.Trigger>
    //                 <Popover.Content
    //                     side="bottom"
    //                     align="center"
    //                     sticky="partial"
    //                 >
    //                     <div className='text-white'>13123</div>
    //                 </Popover.Content>
    //         </Popover.Root>
    //     )
    return <></>
}


const useSetShortcut = () => {
    const store = useStore()
    const changeVis = () => {
        store.set(visAtom, !store.get(visAtom))
    }

    const changeVal = (val: string) => {
        store.set(valAtom, val)
    }

    return {
        SetShortcutModel, changeVal, changeVis
    }
}

export default useSetShortcut
