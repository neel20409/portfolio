"use client";

import { useEffect, useState } from "react";
import { IconEye } from "@tabler/icons-react";

export const VisitorCounter = () => {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
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
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 text-xs font-medium pointer-events-auto select-none transition-all shadow-lg shadow-black/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-300 font-semibold">{count.toLocaleString()}</span>
            <span className="hidden sm:inline text-gray-400 text-[11px]">Visitors</span>
        </div>
    );
};
