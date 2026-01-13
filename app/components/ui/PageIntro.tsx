"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PageIntro() {
    const [hide, setHide] = useState(false);

    // useEffect(() => {
    //     // Total animation time ≈ 4s
    //     const timer = setTimeout(() => setHide(true), 4200);
    //     return () => clearTimeout(timer);
    // }, []);

    if (hide) return null;

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
