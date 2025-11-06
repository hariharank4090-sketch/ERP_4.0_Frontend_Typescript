import React from "react";
import { Home } from "@mui/icons-material";
import NavigateButton from "./navigationButton";

export default function PageNotFound(): React.JSX.Element {
    const goHome = () => {
        window.location.href = "/";
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center text-center"
            // style={{ background: "linear-gradient(180deg,#f7f5f8,#f2fbff)" }}
        >
            {/* Outer soft circle */}
            <div
                className="w-40 h-40 flex items-center justify-center rounded-full mb-8"
                style={{
                    background: "linear-gradient(135deg,#FFE6EE,#FFB3C6)",
                    boxShadow:
                        "12px 12px 24px rgba(0,0,0,0.08), -8px -8px 18px rgba(255,255,255,0.9)",
                }}
            >
                <div
                    className="w-28 h-28 flex items-center justify-center rounded-full"
                    style={{
                        background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9), rgba(255,255,255,0.3))",
                        boxShadow:
                            "inset 6px 6px 10px rgba(0,0,0,0.06), inset -6px -6px 12px rgba(255,255,255,0.6)",
                    }}
                >
                    <span className="text-5xl font-bold text-[#7B3F6B]">404</span>
                </div>
            </div>

            {/* Message section */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-6 max-w-md">
                The page you are looking for might have been removed, renamed, or is temporarily unavailable.
            </p>

            {/* Home button */}
            <NavigateButton path="/">
                <button
                    onClick={goHome}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition-transform hover:-translate-y-1"
                    style={{
                        background: "linear-gradient(135deg,#FFD59E,#FFF3E6)",
                        boxShadow:
                            "6px 6px 14px rgba(0,0,0,0.08), -6px -6px 14px rgba(255,255,255,0.9)",
                    }}
                >
                    <Home style={{ fontSize: 20, color: "#7B3F6B" }} />
                    <span className="text-[#7B3F6B]">Go Home</span>
                </button>
            </NavigateButton>

            <style>{`body { margin: 0; font-family: 'Inter', sans-serif; }`}</style>
        </div>
    );
}