"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { submitInquiry } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShoppingCart, Plus, Minus, Trash2, CheckCircle2, 
    ArrowRight, Lock, User, Mail, Phone, CreditCard, X, 
    ChevronRight, Info, Check, AlertCircle, ShoppingBag
} from "lucide-react";

// Curated products list matching Parabolica brand
const PRODUCTS = [
    {
        id: "mercedes-polo",
        title: "Mercedes-AMG Petronas F1 Team Polo",
        price: 80.00,
        description: "Official Mercedes F1 team polo shirt. Features the iconic Petronas green styling accents, structured fabric, and high-performance branding details.",
        image: "/assets/merch/mercedes_polo.png",
        category: "MERCEDES",
        sizes: ["S", "M", "L", "XL", "XXL"],
        customizable: true,
        badge: "HOT SELLER",
        smokeColor: { r: 13, g: 148, b: 136 } // Teal/Green smoke
    },
    {
        id: "ferrari-jacket",
        title: "Scuderia Ferrari Varsity Racing Jacket",
        price: 150.00,
        description: "Premium Scuderia Ferrari F1 team jacket. Iconic racing red and black body with detailed embroideries, side zip pockets, and lightweight quilted lining.",
        image: "/assets/merch/ferrari_jacket.png",
        category: "FERRARI",
        sizes: ["S", "M", "L", "XL", "XXL"],
        customizable: true,
        badge: "LIMITED EDITION",
        smokeColor: { r: 220, g: 38, b: 38 } // Red smoke
    },
    {
        id: "redbull-hoodie",
        title: "Oracle Red Bull Racing Team Hoodie",
        price: 95.00,
        description: "Official Red Bull Racing Team hoodie in rich navy blue fabric. Contrasting red and yellow logo prints, rib-knit hem/cuffs, and adjustable drawstring hood.",
        image: "/assets/merch/redbull_hoodie.png",
        category: "REDBULL",
        sizes: ["S", "M", "L", "XL", "XXL"],
        customizable: false,
        badge: "CHAMPIONS EDITION",
        smokeColor: { r: 29, g: 78, b: 216 } // Blue smoke
    },
    {
        id: "mclaren-tee",
        title: "McLaren F1 Team Essentials Tee",
        price: 55.00,
        description: "Official McLaren F1 Team lightweight t-shirt. Classic McLaren papaya orange with sleek logo print on chest and breathable active-wear structure.",
        image: "/assets/merch/mclaren_tee.png",
        category: "MCLAREN",
        sizes: ["S", "M", "L", "XL"],
        customizable: false,
        badge: "ESSENTIALS",
        smokeColor: { r: 249, g: 115, b: 22 } // Orange smoke
    }
];

const CATEGORIES = ["ALL", "FERRARI", "REDBULL", "MERCEDES", "MCLAREN"];

const TEAM_SMOKE_COLORS: Record<string, { r: number; g: number; b: number }> = {
    ALL: { r: 13, g: 148, b: 136 },
    FERRARI: { r: 220, g: 38, b: 38 },
    REDBULL: { r: 29, g: 78, b: 216 },
    MERCEDES: { r: 13, g: 148, b: 136 },
    MCLAREN: { r: 249, g: 115, b: 22 }
};

interface CartItem {
    id: string;
    product: typeof PRODUCTS[number];
    size: string;
    customName?: string;
    customNumber?: string;
    quantity: number;
}

export default function ShopPage() {
    // UI state
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[number] | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Cart state
    const [cart, setCart] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0); // decimal percentage
    const [promoError, setPromoError] = useState("");
    const [promoSuccess, setPromoSuccess] = useState("");

    // Details/Customization state for selected product
    const [chosenSize, setChosenSize] = useState("");
    const [customName, setCustomName] = useState("");
    const [customNumber, setCustomNumber] = useState("");
    const [detailQty, setDetailQty] = useState(1);

    // Checkout form state
    const [checkoutStep, setCheckoutStep] = useState(1); // 1: Info, 2: Address, 3: Payment, 4: Success
    const [checkoutInfo, setCheckoutInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
        cardName: ""
    });
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState("");
    const [isGuestOrder, setIsGuestOrder] = useState(false);

    // References for smoke canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const activeSmokeColor = useRef({ r: 13, g: 148, b: 136 }); // Default teal

    // Parse 'team' parameter from URL client-side
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const teamParam = params.get("team");
            if (teamParam) {
                const upperTeam = teamParam.toUpperCase();
                if (CATEGORIES.includes(upperTeam)) {
                    setSelectedCategory(upperTeam);
                }
            }
        }
    }, []);

    // Load session info to auto-fill details
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setCheckoutInfo(prev => ({
                        ...prev,
                        name: session.user.user_metadata?.full_name || "",
                        email: session.user.email || "",
                        phone: session.user.user_metadata?.phone_number || ""
                    }));
                }
            } catch (err) {
                console.warn("Session check skipped:", err);
            }
        };
        fetchSession();
    }, []);

    // Load Cart from localStorage
    useEffect(() => {
        const storedCart = localStorage.getItem("parabolica-merch-cart");
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart:", e);
            }
        }
    }, []);

    // Save Cart to localStorage
    const saveCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem("parabolica-merch-cart", JSON.stringify(newCart));
    };

    // Smoke Canvas Background Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Smoke particles configuration
        type Particle = { x: number; y: number; r: number; alpha: number; vx: number; vy: number; va: number };
        const particles: Particle[] = [];
        const particleCount = 35;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 120 + Math.random() * 200,
                alpha: Math.random() * 0.08,
                vx: (Math.random() - 0.5) * 0.1,
                vy: -Math.random() * 0.2 - 0.05,
                va: (Math.random() - 0.5) * 0.0001,
            });
        }

        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Slow ease color updates towards selected category color
            const targetColor = TEAM_SMOKE_COLORS[selectedCategory] || TEAM_SMOKE_COLORS.ALL;
            
            activeSmokeColor.current.r += (targetColor.r - activeSmokeColor.current.r) * 0.05;
            activeSmokeColor.current.g += (targetColor.g - activeSmokeColor.current.g) * 0.05;
            activeSmokeColor.current.b += (targetColor.b - activeSmokeColor.current.b) * 0.05;

            particles.forEach((p) => {
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                const col = activeSmokeColor.current;
                g.addColorStop(0, `rgba(${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)},${p.alpha})`);
                g.addColorStop(0.5, `rgba(${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)},${p.alpha * 0.35})`);
                g.addColorStop(1, "rgba(0,0,0,0)");
                
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                p.alpha += p.va;

                if (p.alpha < 0.005) p.alpha = 0.005;
                if (p.alpha > 0.08) p.va *= -1;
                if (p.y + p.r < 0) { 
                    p.y = canvas.height + p.r; 
                    p.x = Math.random() * canvas.width; 
                }
                if (p.x < -p.r || p.x > canvas.width + p.r) p.vx *= -1;
            });
            
            animId = requestAnimationFrame(tick);
        };
        tick();

        return () => { 
            cancelAnimationFrame(animId); 
            window.removeEventListener("resize", resize); 
        };
    }, [selectedCategory]);

    // Handle Promo Code Apply
    const applyPromo = () => {
        setPromoError("");
        setPromoSuccess("");
        const code = promoCode.trim().toUpperCase();
        if (code === "PARABOLICA10") {
            setDiscount(0.10);
            setPromoSuccess("10% ACCESS DISCOUNT APPLIED!");
        } else if (code === "LIVERY20") {
            setDiscount(0.20);
            setPromoSuccess("20% TEAM DISCOUNT APPLIED!");
        } else if (code === "") {
            setPromoError("Please enter a code.");
        } else {
            setPromoError("INVALID ACCESS CODE.");
        }
    };

    // Cart actions
    const addToCart = (product: typeof PRODUCTS[number]) => {
        if (!chosenSize) {
            alert("Please select a size first.");
            return;
        }

        const cartItemId = `${product.id}-${chosenSize}-${customName.trim()}-${customNumber.trim()}`;
        const existingIndex = cart.findIndex(item => item.id === cartItemId);
        
        let newCart = [...cart];
        if (existingIndex > -1) {
            newCart[existingIndex].quantity += detailQty;
        } else {
            newCart.push({
                id: cartItemId,
                product,
                size: chosenSize,
                customName: product.customizable && customName ? customName.trim().toUpperCase() : undefined,
                customNumber: product.customizable && customNumber ? customNumber.trim() : undefined,
                quantity: detailQty
            });
        }
        
        saveCart(newCart);
        
        // Reset inputs
        setChosenSize("");
        setCustomName("");
        setCustomNumber("");
        setDetailQty(1);
        setSelectedProduct(null);
        
        // Open Cart Sidebar
        setIsCartOpen(true);
    };

    const updateQuantity = (itemId: string, delta: number) => {
        const newCart = cart.map(item => {
            if (item.id === itemId) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: Math.max(1, newQty) };
            }
            return item;
        });
        saveCart(newCart);
    };

    const removeCartItem = (itemId: string) => {
        const newCart = cart.filter(item => item.id !== itemId);
        saveCart(newCart);
    };

    // Calculations
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    // Checkout submission
    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (checkoutStep < 3) {
            setCheckoutStep(prev => prev + 1);
            return;
        }

        setIsSubmittingOrder(true);
        setIsGuestOrder(false);

        // Compile order payload details
        const orderSummary = cart.map(item => ({
            product: item.product.title,
            size: item.size,
            customization: item.customName || item.customNumber 
                ? { name: item.customName, number: item.customNumber } 
                : "None",
            quantity: item.quantity,
            price_each: `$${item.product.price.toFixed(2)}`,
            total: `$${(item.product.price * item.quantity).toFixed(2)}`
        }));

        const orderText = `
📦 PARABOLICA WEB APPAREL ORDER
====================================
CUSTOMER INFO:
Name: ${checkoutInfo.name}
Email: ${checkoutInfo.email}
Phone: ${checkoutInfo.phone}

SHIPPING COORDINATES:
Address: ${checkoutInfo.address}
City: ${checkoutInfo.city}, ${checkoutInfo.state} - ${checkoutInfo.zip}

ORDER DETAILS:
${JSON.stringify(orderSummary, null, 2)}

FINANCIAL SUMMARY:
Subtotal: $${subtotal.toFixed(2)}
Discount: -$${discountAmount.toFixed(2)}
Total Paid (Simulated): $${total.toFixed(2)}
====================================
STATUS: PLACED
`;

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const res = await submitInquiry({
                    event_type: "MERCHANDISE_ORDER",
                    location: "ONLINE STORE",
                    pilot_name: checkoutInfo.name,
                    pilot_email: checkoutInfo.email,
                    pilot_phone: checkoutInfo.phone,
                    message: orderText
                });

                if (res?.success) {
                    setCreatedOrderId(res.inquiry_id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`);
                } else {
                    setCreatedOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
                }
            } else {
                setIsGuestOrder(true);
                setCreatedOrderId(`GUEST-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
            }
        } catch (err) {
            console.error("Order logging skipped, using simulated ID:", err);
            setIsGuestOrder(true);
            setCreatedOrderId(`SIM-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
        } finally {
            setIsSubmittingOrder(false);
            setCheckoutStep(4);
            saveCart([]); // Clear Cart upon successful order
        }
    };

    // Filter products based on selected team banner category
    const filteredProducts = selectedCategory === "ALL" 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#00ffd2] selection:text-black relative overflow-hidden">
            <Navbar />

            {/* Custom Smokey canvas animation */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20" />

            {/* Tech grid overlay */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Vignette gradients */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(255,255,255,0.8)_100%)] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/80 to-transparent z-[1] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-[1] pointer-events-none" />

            {/* Main content body */}
            <div className="container mx-auto px-4 sm:px-6 pt-32 pb-24 relative z-10">
                
                {/* Store Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 mb-12 gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-800 animate-pulse" />
                            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.3em]">GEAR LINK ESTABLISHED // TEAM WEAR</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900">
                            MERCHANDISE
                        </h1>
                    </div>

                    {/* Cart Trigger Badge */}
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-400 group transition-all duration-300 relative self-start md:self-auto cursor-pointer shadow-sm"
                    >
                        <ShoppingCart className="w-5 h-5 text-slate-800 group-hover:text-slate-900 transition-colors" />
                        <span className="font-mono text-xs uppercase tracking-wider hidden sm:inline text-slate-600">CART STATUS</span>
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-[10px] flex items-center justify-center font-mono shadow-sm">
                            {cartCount}
                        </div>
                    </button>
                </div>

                {/* Elegant category filter pills */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-2.5">
                        {CATEGORIES.map((cat) => {
                            const isActive = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                                        isActive
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                                    }`}
                                >
                                    {cat === "ALL" ? "EXPLORE ALL" : cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="space-y-8">
                    <div className="border-b border-slate-200 pb-3">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                            DEPLOYED GEAR ({filteredProducts.length} ITEMS)
                        </h3>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="py-24 text-center bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
                            <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                                Catalog Transit Status
                            </h4>
                            <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto font-light">
                                McLaren gear and accessories are currently undergoing terminal sync. Please check back shortly.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="group relative bg-white border border-slate-200/60 rounded-2xl overflow-hidden flex flex-col hover:border-slate-400 hover:shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition-all duration-500 shadow-sm flex-1"
                                >
                                    {/* Glowing top line indicator on hover */}
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    {/* Product image container */}
                                    <div className="relative h-72 w-full bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
                                        <Image
                                            src={prod.image}
                                            alt={prod.title}
                                            fill
                                            className="object-cover group-hover:scale-103 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                        />
                                        
                                        {prod.badge && (
                                            <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-widest uppercase">
                                                {prod.badge}
                                            </div>
                                        )}

                                        {/* Configuration Hover Action Button */}
                                        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-[1px] gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(prod);
                                                    setChosenSize(prod.sizes[0]);
                                                    setCustomName("");
                                                    setCustomNumber("");
                                                    setDetailQty(1);
                                                }}
                                                className="px-6 py-3 bg-slate-900 text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-slate-800 hover:scale-103 transition-all shadow-lg cursor-pointer"
                                            >
                                                CONFIGURE GEAR
                                            </button>
                                        </div>
                                    </div>

                                    {/* Text content details */}
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[9px] text-slate-400 tracking-widest uppercase font-bold">
                                                    {prod.category}
                                                </span>
                                                <span className="font-mono text-sm font-black text-slate-800">
                                                    ${prod.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold uppercase text-slate-800 group-hover:text-slate-950 transition-colors leading-tight">
                                                {prod.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">
                                                {prod.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Configuration Details Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-4xl overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row z-10 shadow-2xl text-slate-800"
                        >
                            {/* Exit button */}
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center hover:text-slate-950 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4 text-slate-600" />
                            </button>

                            {/* Left: Product Images */}
                            <div className="md:w-1/2 relative bg-slate-50 min-h-[250px] md:min-h-auto border-b md:border-b-0 md:border-r border-slate-100">
                                <Image
                                    src={selectedProduct.image}
                                    alt={selectedProduct.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Right: Configurations */}
                            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[90vh] custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[9px] font-mono tracking-widest text-slate-500 uppercase inline-block">
                                            {selectedProduct.category}
                                        </span>
                                        <h2 className="text-xl md:text-2xl font-black italic uppercase leading-tight text-slate-900">
                                            {selectedProduct.title}
                                        </h2>
                                        <span className="font-mono text-lg font-bold text-slate-800 block">
                                            ${selectedProduct.price.toFixed(2)}
                                        </span>
                                        <p className="text-xs text-slate-500 leading-relaxed font-light">
                                            {selectedProduct.description}
                                        </p>
                                    </div>

                                    {/* Sizing selection */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-slate-400">
                                            <span>SELECT SIZE:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.sizes.map((sz) => (
                                                <button
                                                    key={sz}
                                                    onClick={() => setChosenSize(sz)}
                                                    className={`px-4 py-2 border rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                                                        chosenSize === sz
                                                        ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                                                    }`}
                                                >
                                                    {sz}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom Embroidery details */}
                                    {selectedProduct.customizable && (
                                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Info className="w-4 h-4 text-slate-700" />
                                                <span className="font-mono text-[10px] font-black text-slate-700 uppercase tracking-wider">
                                                    BACK EMBROIDERY SERVICE
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                                                        CUSTOM NAME
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={12}
                                                        placeholder="NORRIS"
                                                        value={customName}
                                                        onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                                                        className="w-full bg-white border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                    />
                                                    <span className="text-[8px] text-slate-400 font-mono text-right block">
                                                        {customName.length}/12 CHARS
                                                    </span>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                                                        RACE NUMBER
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={99}
                                                        placeholder="4"
                                                        value={customNumber}
                                                        onChange={(e) => {
                                                            const num = parseInt(e.target.value);
                                                            if (isNaN(num)) setCustomNumber("");
                                                            else setCustomNumber(Math.min(99, Math.max(0, num)).toString());
                                                        }}
                                                        className="w-full bg-white border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                    />
                                                    <span className="text-[8px] text-slate-400 font-mono text-right block">
                                                        00 - 99 LIMIT
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quantity controls */}
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                        <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                                            QUANTITY:
                                        </span>
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg">
                                            <button
                                                onClick={() => setDetailQty(prev => Math.max(1, prev - 1))}
                                                className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-4 font-mono text-sm">{detailQty}</span>
                                            <button
                                                onClick={() => setDetailQty(prev => prev + 1)}
                                                className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        onClick={() => addToCart(selectedProduct)}
                                        className="w-full bg-slate-900 text-white py-4 font-black uppercase text-sm italic tracking-widest hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        ADD TO ACCESS STORAGE
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Shopping Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <div className="fixed inset-0 z-[160] flex justify-end">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        />

                        {/* Drawer body */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-md bg-white/95 border-l border-slate-200/80 h-full shadow-2xl flex flex-col justify-between p-6 z-10 backdrop-blur-md text-slate-800"
                        >
                            {/* Drawer header */}
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-slate-800" />
                                    <h3 className="font-black italic uppercase tracking-wider text-lg text-slate-900">
                                        MODULE STORAGE
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-1 text-slate-400 hover:text-slate-950 transition-colors cursor-pointer"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Cart List */}
                            <div className="flex-1 overflow-y-auto py-6 space-y-4 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                                        <ShoppingBag className="w-12 h-12 text-slate-200 animate-pulse" />
                                        <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
                                            STORAGE SYSTEM IS EMPTY.
                                        </p>
                                        <span className="text-[10px] text-slate-355 uppercase">
                                            SELECT GEAR TO DEPLOY TO MODULE.
                                        </span>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex gap-3 relative group"
                                        >
                                            {/* Delete Item button */}
                                            <button
                                                onClick={() => removeCartItem(item.id)}
                                                className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            {/* Product Thumbnail */}
                                            <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/60 flex-shrink-0">
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Details text */}
                                            <div className="flex-1 space-y-2 pr-6">
                                                <div className="space-y-0.5">
                                                    <h4 className="text-sm font-bold text-slate-800 uppercase italic tracking-wide truncate">
                                                        {item.product.title}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                                                        <span>SIZE: {item.size}</span>
                                                        <span>${item.product.price.toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                {/* Customized back details */}
                                                {(item.customName || item.customNumber) && (
                                                    <div className="bg-slate-200/50 border border-slate-300/40 px-2 py-1 rounded text-[9px] font-mono text-slate-600 space-y-0.5 inline-block">
                                                        {item.customName && <div>NAME: {item.customName}</div>}
                                                        {item.customNumber && <div>NUMBER: #{item.customNumber}</div>}
                                                    </div>
                                                )}

                                                {/* Quantity toggle controls */}
                                                <div className="flex items-center bg-white border border-slate-250 rounded-md w-max shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="px-2 py-0.5 text-slate-400 hover:text-slate-700 transition-colors"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="px-2.5 font-mono text-xs text-slate-700">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="px-2 py-0.5 text-slate-400 hover:text-slate-700 transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Subtotal and checkout details */}
                            {cart.length > 0 && (
                                <div className="border-t border-slate-100 pt-4 space-y-4">
                                    
                                    {/* Promo Code Input */}
                                    <div className="space-y-1.5">
                                        <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                                            PROMO PROTOCOL CODE
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="e.g. PARABOLICA10"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                            />
                                            <button
                                                onClick={applyPromo}
                                                className="bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 px-4 text-xs font-mono font-bold transition-all cursor-pointer rounded-lg"
                                            >
                                                APPLY
                                            </button>
                                        </div>
                                        {promoError && (
                                            <span className="text-[9px] font-mono text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                                            </span>
                                        )}
                                        {promoSuccess && (
                                            <span className="text-[9px] font-mono text-slate-800 flex items-center gap-1">
                                                <Check className="w-3.5 h-3.5" /> {promoSuccess}
                                            </span>
                                        )}
                                    </div>

                                    {/* Order Calculations */}
                                    <div className="space-y-2 bg-slate-50 border border-slate-100 p-4 rounded-xl font-mono text-xs text-slate-600">
                                        <div className="flex justify-between">
                                            <span>SUBTOTAL</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-slate-800 font-bold">
                                                <span>DISCOUNT</span>
                                                <span>-${discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>SHIPPING DATA</span>
                                            <span className="text-[10px] text-slate-600 uppercase font-bold">FREE SHIPPING</span>
                                        </div>
                                        <div className="flex justify-between text-base font-black border-t border-slate-200 pt-2 text-slate-900">
                                            <span>TOTAL PROTOCOL</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            setIsCheckoutOpen(true);
                                            setCheckoutStep(1);
                                        }}
                                        className="w-full bg-slate-900 text-white py-4 font-black uppercase text-sm italic tracking-widest hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        PROCEED TO TERMINAL CHECKOUT
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Multistep Checkout Modal Overlay */}
            <AnimatePresence>
                {isCheckoutOpen && (
                    <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Dialog body */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-xl bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col justify-between max-h-[90vh] overflow-y-auto custom-scrollbar z-10 text-slate-800"
                        >
                            {/* Exit button */}
                            {checkoutStep < 4 && (
                                <button
                                    onClick={() => setIsCheckoutOpen(false)}
                                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center hover:text-slate-950 transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-slate-600" />
                                </button>
                            )}

                            {/* Header / Steps Indicator */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-slate-700" />
                                    <span className="font-mono text-[9px] tracking-[0.3em] text-slate-500 uppercase">
                                        SECURE TRANSACTION PORTAL // STEP {checkoutStep} OF 3
                                    </span>
                                </div>
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                    <div 
                                        className="h-full bg-slate-900 transition-all duration-500 shadow-sm" 
                                        style={{ width: `${checkoutStep * 25}%` }}
                                    />
                                </div>
                            </div>

                            {/* Forms */}
                            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                                
                                {/* Step 1: Customer details */}
                                {checkoutStep === 1 && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-black italic uppercase text-slate-900">PILOT IDENTIFICATION</h3>
                                            <p className="text-xs text-slate-500">Provide contact coordinates to link with your transaction.</p>
                                        </div>

                                        <div className="space-y-3.5">
                                            <div className="space-y-1.5">
                                                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-slate-400" /> FULL NAME
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Lando Norris"
                                                    value={checkoutInfo.name}
                                                    onChange={(e) => setCheckoutInfo({ ...checkoutInfo, name: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" /> EMAIL ADDRESS
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="ln4@parabolica.com"
                                                    value={checkoutInfo.email}
                                                    onChange={(e) => setCheckoutInfo({ ...checkoutInfo, email: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" /> PHONE NUMBER
                                                </label>
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="+91 91040 12012"
                                                    value={checkoutInfo.phone}
                                                    onChange={(e) => setCheckoutInfo({ ...checkoutInfo, phone: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Shipping Coordinates */}
                                {checkoutStep === 2 && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-black italic uppercase text-slate-900">DELIVERY COORDINATES</h3>
                                            <p className="text-xs text-slate-500">Specify the shipping destination coordinates.</p>
                                        </div>

                                        <div className="space-y-3.5">
                                            <div className="space-y-1.5">
                                                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                                                    STREET ADDRESS
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Sector 5, Cyber City Terminal A"
                                                    value={checkoutInfo.address}
                                                    onChange={(e) => setCheckoutInfo({ ...checkoutInfo, address: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                />
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                                                        CITY
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Surat"
                                                        value={checkoutInfo.city}
                                                        onChange={(e) => setCheckoutInfo({ ...checkoutInfo, city: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                                                        STATE
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Gujarat"
                                                        value={checkoutInfo.state}
                                                        onChange={(e) => setCheckoutInfo({ ...checkoutInfo, state: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                                                        ZIP CODE
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="395007"
                                                        value={checkoutInfo.zip}
                                                        onChange={(e) => setCheckoutInfo({ ...checkoutInfo, zip: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Payment Terminal */}
                                {checkoutStep === 3 && (
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-black italic uppercase text-slate-900">SECURE PAYMENT</h3>
                                            <p className="text-xs text-slate-500">Secure validation gateway. Simulate transaction by entering cards details.</p>
                                        </div>

                                        {/* Card mockup flip animations */}
                                        <div className="perspective-1000 w-full h-44 relative hidden sm:block">
                                            <div 
                                                className={`w-full h-full duration-700 preserve-3d relative cursor-pointer ${isCardFlipped ? "rotate-y-180" : ""}`}
                                                onClick={() => setIsCardFlipped(!isCardFlipped)}
                                            >
                                                {/* Front Side */}
                                                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/15 rounded-2xl p-5 flex flex-col justify-between text-white font-mono shadow-xl">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] tracking-[0.2em] font-black italic text-[#00ffd2]">PARABOLICA MEMBER CARD</span>
                                                        <CreditCard className="w-8 h-8 text-[#00ffd2]" />
                                                    </div>
                                                    <div className="text-lg tracking-[0.25em] py-2">
                                                        {checkoutInfo.cardNumber ? checkoutInfo.cardNumber.replace(/(\d{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                                                    </div>
                                                    <div className="flex justify-between items-end text-xs uppercase">
                                                        <div>
                                                            <div className="text-[8px] text-white/35">CARDHOLDER</div>
                                                            <div className="truncate max-w-[200px]">{checkoutInfo.cardName || "LANDO NORRIS"}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[8px] text-white/35 text-right">EXPIRES</div>
                                                            <div>{checkoutInfo.cardExpiry || "12/28"}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Back Side */}
                                                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/15 rounded-2xl py-5 flex flex-col justify-between text-white font-mono shadow-xl">
                                                    <div className="w-full h-8 bg-zinc-800 my-1" />
                                                    <div className="px-5 flex items-center justify-end gap-3">
                                                        <span className="text-[8px] text-white/35">CVV CODE</span>
                                                        <div className="bg-white text-black font-black px-3 py-1 rounded text-sm italic tracking-widest">
                                                            {checkoutInfo.cardCvv || "000"}
                                                        </div>
                                                    </div>
                                                    <div className="px-5 text-[8px] text-white/20 text-right uppercase">
                                                        PARABOLICA AUTH SERVICE • VALIDATED
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3.5">
                                            <div className="space-y-1.5">
                                                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                                                    CARDHOLDER NAME
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Lando Norris"
                                                    value={checkoutInfo.cardName}
                                                    onChange={(e) => setCheckoutInfo({ ...checkoutInfo, cardName: e.target.value.toUpperCase() })}
                                                    onFocus={() => setIsCardFlipped(false)}
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                                                    CARD NUMBER
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    maxLength={16}
                                                    placeholder="4000123456789010"
                                                    value={checkoutInfo.cardNumber}
                                                    onChange={(e) => {
                                                        const clean = e.target.value.replace(/\D/g, "");
                                                        setCheckoutInfo({ ...checkoutInfo, cardNumber: clean.substring(0, 16) });
                                                    }}
                                                    onFocus={() => setIsCardFlipped(false)}
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                                                        EXPIRY DATE
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        maxLength={5}
                                                        value={checkoutInfo.cardExpiry}
                                                        onChange={(e) => {
                                                            let val = e.target.value;
                                                            if (val.length === 2 && !val.includes("/")) val += "/";
                                                            setCheckoutInfo({ ...checkoutInfo, cardExpiry: val });
                                                        }}
                                                        onFocus={() => setIsCardFlipped(false)}
                                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                                                        CVV CODE
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        maxLength={3}
                                                        placeholder="000"
                                                        value={checkoutInfo.cardCvv}
                                                        onChange={(e) => {
                                                            const clean = e.target.value.replace(/\D/g, "");
                                                            setCheckoutInfo({ ...checkoutInfo, cardCvv: clean.substring(0, 3) });
                                                        }}
                                                        onFocus={() => setIsCardFlipped(true)}
                                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-800 rounded-lg focus:outline-none focus:border-slate-800"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Success confirmation screen */}
                                {checkoutStep === 4 && (
                                    <div className="text-center space-y-6 py-6 font-sans">
                                        <div className="flex justify-center">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm animate-pulse">
                                                <CheckCircle2 className="w-8 h-8 text-slate-900" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em] block">
                                                TRANSACTION PORTAL FEED // ORDER ASSIGNED
                                            </span>
                                            <h3 className="text-2xl font-black italic uppercase text-slate-900">
                                                ORDER CONFIRMED
                                            </h3>
                                            <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
                                                Your team gear coordinates have been link-established in our database. Processing dispatch feeds now.
                                            </p>
                                        </div>

                                        {/* Order ID detail */}
                                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl max-w-sm mx-auto font-mono text-xs text-left space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">ORDER ID:</span>
                                                <span className="text-slate-800 font-bold">{createdOrderId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">TRANSACTION STATUS:</span>
                                                <span className="text-slate-800 font-black uppercase">
                                                    {isGuestOrder ? "CONFIRMED (GUEST)" : "DEPLOYED (DATABASE)"}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setIsCheckoutOpen(false)}
                                            className="px-8 py-3 bg-slate-900 text-white font-black uppercase text-xs tracking-wider rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                                        >
                                            RETURN TO APEX STORE
                                        </button>
                                    </div>
                                )}

                                {/* Next Action buttons */}
                                {checkoutStep < 4 && (
                                    <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-8 gap-4">
                                        {checkoutStep > 1 ? (
                                            <button
                                                type="button"
                                                onClick={() => setCheckoutStep(prev => prev - 1)}
                                                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer text-slate-600"
                                            >
                                                BACK
                                            </button>
                                        ) : (
                                            <div />
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmittingOrder}
                                            className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-xs font-mono font-black uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer"
                                        >
                                            {isSubmittingOrder ? (
                                                "SAVING ORDER DATA..."
                                            ) : checkoutStep === 3 ? (
                                                `VALIDATE TRANSACTION $${total.toFixed(2)}`
                                            ) : (
                                                <>
                                                    CONTINUE
                                                    <ChevronRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />

            {/* Custom 3D CSS Perspectives & Animations for Credit Card */}
            <style dangerouslySetInnerHTML={{ __html: `
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
                .perspective-1000 input[type="number"]::-webkit-outer-spin-button,
                .perspective-1000 input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            ` }} />
        </div>
    );
}
