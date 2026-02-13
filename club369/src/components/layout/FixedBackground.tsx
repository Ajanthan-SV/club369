import React from "react";

export default function FixedBackground() {
    const logoUrl = "/images/cloud369.png";

    return (
        <div className="fixed inset-0 z-0 flex items-center justify-center opacity-25 pointer-events-none overflow-hidden">
            <img
                src={logoUrl}
                alt="CLUB369"
                className="w-[110vw] h-[110vh] md:w-[60vw] md:h-[60vw] object-contain blur-[1px] transition-all duration-1000"
            />
        </div>
    );
}
