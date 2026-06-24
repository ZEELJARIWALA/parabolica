"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OtherGamesPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/coming-soon");
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-pulse font-mono text-[#00ffd2] text-xs tracking-widest uppercase">
                Redirecting to Command Center...
            </div>
        </div>
    );
}
