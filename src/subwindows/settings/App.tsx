import React from "react";
import {createStore, Provider} from "jotai/index";

const jotaiStore = createStore()

function App() {

    return (
        <Provider store={jotaiStore}>
            <div className='bg-white'>
                hello world
            </div>
        </Provider>
    )
}

export default App