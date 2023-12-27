import * as React from "react";

interface Props {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

const defaultStyle: React.CSSProperties = {
    position: "fixed",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    inset: "0px",
    width: '100vw',
    height: '100vh',
    padding: '0',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

function getStyle(style: React.CSSProperties | undefined) {
    return style ? {...defaultStyle, ...style} : defaultStyle;
}

export const KBarPositioner: React.FC<React.PropsWithChildren<Props>> =
    React.forwardRef<HTMLDivElement, Props>(
        ({style, children, ...props}, ref) => (
            <div ref={ref} style={getStyle(style)} {...props}>
                {children}
            </div>
        )
    );
