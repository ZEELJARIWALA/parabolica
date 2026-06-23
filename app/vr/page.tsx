"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ScrollProgress from "@/components/scroll-progress";
import Footer from "@/components/footer";
import VRHero        from "@/components/sections/vr-hero";
import VRHeadset     from "@/components/sections/vr-headset";
import VRController  from "@/components/sections/vr-controller";
import VRHaptics     from "@/components/sections/vr-haptics";
import VRArena       from "@/components/sections/vr-arena";
import VRMaps        from "@/components/sections/vr-maps";
import VRBookingCTA  from "@/components/sections/vr-booking-cta";
import { useLenis }  from "@/components/smooth-scroll";

export default function VRArenaPage() {
    const lenis = useLenis();

    useEffect(() => {
        if (lenis) lenis.scrollTo(0, { immediate: true });
    }, [lenis]);

    return (
        <main className="bg-black min-h-screen text-white overflow-hidden">
            <ScrollProgress />

            {/* ── Page sections ── */}
            <div>
                {/* 1. Hero — smoky, pulsing Enter button */}
                <VRHero />

                {/* 2. VR Headset — gear section 1 */}
                <VRHeadset />

                {/* 3. VR Controller — gear section 2 */}
                <VRController />

                {/* 4. Haptic Vest — gear section 3 */}
                <VRHaptics />

                {/* 5. The Arena — physical venue */}
                <VRArena />

                {/* 5.5 Virtual Maps — Where you fight */}
                <VRMaps />

                {/* 7. Book a session CTA */}
                <VRBookingCTA />

                <Footer />
            </div>
        </main>
    );
}
