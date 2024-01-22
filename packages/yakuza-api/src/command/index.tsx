import * as React from "react";

export * from "./Input";
export * from "./useActionStore";
export * from "./useMatches";
export * from "./RenderItem";
export * from "./Footer";
export * from "./ResultsRender";
export * from "./types";
export * from "./action";


export const Container = ({children}: { children: React.ReactNode }) => {
    return <div className='command-container'>
        {children}
    </div>
}

export const Background = ({children}: { children: React.ReactNode }) => {
    return <div className='command-background'>
        {children}
    </div>
}