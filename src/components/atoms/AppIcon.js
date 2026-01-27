import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const icons = {
    menu: (color) => (
        <>
            <Path d="M3 6h18M3 12h18M3 18h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </>
    ),

    newspaper: (color) => (
        <>
            <Path d="M4 4h14v16H4z" stroke={color} strokeWidth={2} />
            <Path d="M8 8h6M8 12h6" stroke={color} strokeWidth={2} />
        </>
    ),

    document: (color) => (
        <>
            <Path d="M6 2h9l5 5v15H6z" stroke={color} strokeWidth={2} />
            <Path d="M9 12h6M9 16h6" stroke={color} strokeWidth={2} />
        </>
    ),

    team: (color) => (
        <>
            {/* Giocatore centrale */}
            <Circle
                cx="12"
                cy="7"
                r="3"
                stroke={color}
                strokeWidth={1.6}
            />

            {/* Giocatori laterali */}
            <Circle
                cx="6"
                cy="9"
                r="2.5"
                stroke={color}
                strokeWidth={1.6}
            />
            <Circle
                cx="18"
                cy="9"
                r="2.5"
                stroke={color}
                strokeWidth={1.6}
            />

            {/* Linea squadra */}
            <Path
                d="M3 20c0-3.5 4-5.5 9-5.5s9 2 9 5.5"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
            />
        </>
    ),


    trophy: (color) => (
        <>
            {/* Coppa */}
            <Path
                d="M7 4h10v3c0 3.3-2.7 6-6 6s-6-2.7-6-6V4z"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />

            {/* Manici */}
            <Path
                d="M7 6H5c0 2.5 1.5 4 3 4M17 6h2c0 2.5-1.5 4-3 4"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
            />

            {/* Stelo */}
            <Path
                d="M12 13v3"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
            />

            {/* Base */}
            <Path
                d="M9 18h6M8 21h8"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
            />
        </>
    ),



    football: (color) => (
        <>
            {/* Contorno palla */}
            <Path
                d="M6 12c0-4 4-6 6-6s6 2 6 6-4 6-6 6-6-2-6-6z"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />

            {/* Cucitura centrale */}
            <Path
                d="M12 7v10"
                stroke={color}
                strokeWidth={1.4}
                strokeLinecap="round"
            />

            {/* Cuciture orizzontali */}
            <Path
                d="M10.5 9h3M10.5 12h3M10.5 15h3"
                stroke={color}
                strokeWidth={1.2}
                strokeLinecap="round"
            />
        </>
    ),



    business: (color) => (
        <>
            <Path d="M3 21V7h18v14z" stroke={color} strokeWidth={2} />
            <Path d="M9 21V3h6v18" stroke={color} strokeWidth={2} />
        </>
    ),

    logout: (color) => (
        <>
            <Path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={2} />
            <Path d="M4 4h6v16H4z" stroke={color} strokeWidth={2} />
        </>
    ),
    chevronUp: (color) => (
        <Path
            d="M6 15l6-6 6 6"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),


    chevronDown: (color) => (
        <Path
            d="M6 9l6 6 6-6"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),

    bag: (color) => (
        <>
            <Path d="M6 7h12l-1 14H7z" stroke={color} strokeWidth={2} />
            <Path d="M9 7a3 3 0 016 0" stroke={color} strokeWidth={2} />
        </>
    ),

    cart: (color) => (
        <>
            <Path
                d="M3 4h2l2 11h11l2-7H7"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Circle cx="10" cy="19" r="1.5" stroke={color} strokeWidth={1.6} />
            <Circle cx="17" cy="19" r="1.5" stroke={color} strokeWidth={1.6} />
        </>
    ),
    shop: (color) => (
        <>
            {/* Corpo borsa */}
            <Path
                d="M6 9.5h12l-0.9 9.8c-0.1 0.9-0.8 1.7-1.8 1.7H8.7c-1 0-1.7-0.8-1.8-1.7L6 9.5z"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />

            {/* Manico sinistro */}
            <Path
                d="M9 9.5V8a3 3 0 016 0v1.5"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
            />
        </>
    ),


    home: (color) => (
        <>
            <Path
                d="M4 11l8-6 8 6"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />
            <Path
                d="M6 10v8h12v-8"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />
        </>
    ),

    profile: (color) => (
        <>
            <Circle
                cx="12"
                cy="8"
                r="3"
                stroke={color}
                strokeWidth={1.6}
            />
            <Path
                d="M4 20c0-4 4-6 8-6s8 2 8 6"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
            />
        </>
    ),

    trash: (color) => (
        <>
            <Path d="M4 7h16" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
            <Path d="M6 7v11c0 1 1 2 2 2h8c1 0 2-1 2-2V7" stroke={color} strokeWidth={1.6} />
            <Path d="M9 7V4h6v3" stroke={color} strokeWidth={1.6} />
        </>
    ),
    download: (color) => (
        <>
            <Path d="M12 4v10" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
            <Path d="M8 10l4 4 4-4" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
            <Path d="M4 18h16" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        </>
    ),

    storefront: (color) => (
        <>
            <Path d="M4 7l2-3h12l2 3" stroke={color} strokeWidth={1.6} />
            <Path d="M5 7v11h14V7" stroke={color} strokeWidth={1.6} />
            <Path d="M10 18v-5h4v5" stroke={color} strokeWidth={1.4} />
        </>
    ),

    card: (color) => (
        <>
            <Path d="M3 7h18v10H3z" stroke={color} strokeWidth={1.6} />
            <Path d="M3 11h18" stroke={color} strokeWidth={1.6} />
            <Path d="M7 15h4" stroke={color} strokeWidth={1.4} />
        </>
    ),
    close: (color) => (
        <>
            <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </>
    ),

    arrow: (color) => (
        <>
            <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </>
    ),

    search: (color) => (
        <>
            <Circle cx="11" cy="11" r="6" stroke={color} strokeWidth={1.6} />
            <Path d="M16 16l4 4" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        </>
    ),
    eyeon: (color) => (
        <>
            <Path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" stroke={color} strokeWidth={1.6} />
            <Circle cx="12" cy="12" r="2.5" stroke={color} strokeWidth={1.6} />
        </>
    ),
    eyeoff: (color) => (
        <>
            <Path d="M3 3l18 18" stroke={color} strokeWidth={1.6} />
            <Path d="M2 12s4-6 10-6c2 0 3.8.6 5.4 1.6" stroke={color} strokeWidth={1.6} />
            <Path d="M22 12s-2 3-5.5 4.8" stroke={color} strokeWidth={1.6} />
        </>
    ),

    qrcode: (color) => (
        <>
            {/* Finder top-left */}
            <Path
                d="M4 4h6v6H4z"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />
            <Path
                d="M6 6h2v2H6z"
                stroke={color}
                strokeWidth={1.6}
            />

            {/* Finder top-right */}
            <Path
                d="M14 4h6v6h-6z"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />
            <Path
                d="M16 6h2v2h-2z"
                stroke={color}
                strokeWidth={1.6}
            />

            {/* Finder bottom-left */}
            <Path
                d="M4 14h6v6H4z"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />
            <Path
                d="M6 16h2v2H6z"
                stroke={color}
                strokeWidth={1.6}
            />

            {/* Moduli interni */}
            <Path
                d="M14 14h2v2h-2zM18 14h2v6h-6v-2"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />
        </>
    ),


};

export default function AppIcon({ name, size = 24, color = "white" }) {
    const icon = icons[name];
    if (!icon) return null;

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {icon(color)}
        </Svg>
    );
}
