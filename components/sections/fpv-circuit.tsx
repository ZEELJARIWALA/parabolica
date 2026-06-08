"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, Float, Text, Environment } from "@react-three/drei";
import * as THREE from "three";

function LayerTrack({ position, color, title, subtitle, sector }: { position: [number, number, number], color: string, title: string, subtitle: string, sector: string }) {
    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh>
                    <cylinderGeometry args={[4, 4, 0.5, 32]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
                </mesh>
            </Float>
            
            {/* Label in 3D Space */}
            <Text
                position={[6, 0, 0]}
                fontSize={0.8}
                color="white"
                anchorX="left"
            >
                {sector}
            </Text>
            <Text
                position={[6, -1, 0]}
                fontSize={1.5}
                color={color}
                anchorX="left"
            >
                {title}
            </Text>
        </group>
    );
}

function VerticalScene() {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        const offset = scroll.offset; // 0 to 1
        // Move the whole track group vertically based on scroll
        if (groupRef.current) {
            groupRef.current.position.y = offset * 40; 
        }
    });

    return (
        <group ref={groupRef}>
            {/* Sector 03: California (Top) */}
            <LayerTrack 
                position={[0, -30, 0]} 
                color="#00ffff" 
                title="CALIFORNIA" 
                subtitle="TECH CITY // THE RIDGE" 
                sector="SECTOR 03"
            />

            {/* Sector 02: Miami (Middle) */}
            <LayerTrack 
                position={[0, -15, 0]} 
                color="#ff00ff" 
                title="MIAMI" 
                subtitle="VICE CITY // THE SHORE" 
                sector="SECTOR 02"
            />

            {/* Sector 01: Las Vegas (Bottom) */}
            <LayerTrack 
                position={[0, 0, 0]} 
                color="#ffaa00" 
                title="LAS VEGAS" 
                subtitle="THE STRIP // THE CASINO" 
                sector="SECTOR 01"
            />

            {/* Vertical Connector Line */}
            <mesh position={[0, -15, -2]}>
                <boxGeometry args={[0.05, 40, 0.05]} />
                <meshBasicMaterial color="white" opacity={0.1} transparent />
            </mesh>
        </group>
    );
}

export default function FPVCircuit() {
    return (
        <section className="relative h-[400vh] bg-black">
            <div className="sticky top-0 h-screen w-full">
                <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                    <color attach="background" args={["#000000"]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#00FFC2" />
                    
                    <ScrollControls pages={4} damping={0.1}>
                        <VerticalScene />
                    </ScrollControls>
                    
                    <Environment preset="city" />
                </Canvas>

                {/* HUD Overlay (Altitude) */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-20 pointer-events-none z-10">
                    <div className="flex flex-col items-center gap-2">
                         <div className="w-[1px] h-32 bg-gradient-to-t from-[#00FFC2] to-transparent" />
                         <span className="text-white/20 font-mono text-[9px] vertical-text tracking-widest uppercase">Altitude</span>
                         <div className="w-[1px] h-32 bg-gradient-to-b from-[#00FFC2] to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}
