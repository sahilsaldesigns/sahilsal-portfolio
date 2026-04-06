import React from "react";
import { twMerge } from "tailwind-merge";

export const Container = ({children, className, ...props}: {children: React.ReactNode, className?: string, [key: string]: any}) => {
    return <div className={twMerge("w-full max-w-[1026px] px-4 mx-auto", className)} {...props}>
        {children}
    </div>
}