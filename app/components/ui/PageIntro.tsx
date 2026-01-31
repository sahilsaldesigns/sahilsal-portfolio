"use client";

import Image from "next/image";

export default function PageIntro() {


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
