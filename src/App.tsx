import Self from '@/components/self';
import {useViewEvent, ViewName} from "@/hooks/useView";
import {useEffect, useState} from "react";
import Store from "@/components/store";


const {emitter} = useViewEvent();


function App() {
    const [view, setView] = useState<ViewName>('self')
    emitter.on('changeView', (view: ViewName) => {
        setView(view)
    })

    useEffect(() => {
        console.log(view)
    }, [view])
    return (
        <div id='top' className='dark text-white bg-dark/95 backdrop-blur'>
            {view === 'self' ? <Self/> : <Store></Store>}
        </div>
    )
}

export default App
