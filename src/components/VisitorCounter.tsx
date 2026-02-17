"use client";

import { useEffect, useState } from "react";
import { IconEye } from "@tabler/icons-react";

export const VisitorCounter = () => {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        // Fetch and increment on mount
        const updateCount = async () => {
            try {
                const res = await fetch("/api/visitors", { method: "POST" });
                const data = await res.json();
                if (typeof data.count === "number") {
                    setCount(data.count);
                }
            } catch (err) {
                console.error("Failed to update visitor count", err);
            }
        };

        updateCount();
    }, []);

    if (count === null) return null;

    return (
        <div className="fixed top-5 right-5 z-[5000] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white/80 text-xs font-medium pointer-events-none select-none">
            <IconEye className="w-4 h-4 text-emerald-400" />
            <span>{count.toLocaleString()} Visitors</span>
        </div>
    );
};
