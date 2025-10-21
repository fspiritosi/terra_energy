"use client";

import Image from "next/image";
import * as React from "react";

export function TeamSwitcher() {
    return (
        <div className="w-full p-2 flex justify-center">
            <div className="bg-white dark:bg-transparent rounded-lg p-2">
                <Image
                    src="/Terra Energy Services - logo dorado.png"
                    alt="Terra Energy Services"
                    className="max-w-32 dark:max-w-32 w-full h-auto object-contain"
                    height={120}
                />
            </div>
        </div>
    );
}
