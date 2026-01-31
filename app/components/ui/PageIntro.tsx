"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function PageIntro({ onComplete }: { onComplete: () => void }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="page-intro">
            <div className="logo-wrapper">
                <div className="logo-shine-mask">
                    <Image
                        src="/uploads/base-logo.svg"  
                        alt="Logo"
                        width={80}
                        height={80}
                        className="intro-logo"
                    />
                </div>
            </div>
        </div>
    );
}