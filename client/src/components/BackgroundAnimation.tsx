import BackgroundLine from './BackgroundLine';

export default function BackgroundAnimation() {
    return <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1080 1920" 
        preserveAspectRatio="none" 
        width={"100%"}
        height={"100%"}
        style={{ 
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 1,
            zIndex: -1,
            transform: "rotate(90deg) scale(1.8)",
            filter: "hue-rotate(36deg)",
            // background: "radial-gradient(circle, rgba(0, 60, 202, 0.3) 0%, rgba(0, 60, 202, 0.1) 100%)"
        }}
    >
    <defs />
    <linearGradient id="SVGID_1_" x1="2880" x2="2880" y1="909.66" y2="170.6" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#1742ff" />
        <stop offset="1" stop-color="#22dd8a" />
    </linearGradient>

    <g>
        <BackgroundLine />
        <BackgroundLine />
        <BackgroundLine />
        <BackgroundLine />
        <BackgroundLine />
        <BackgroundLine />
        <BackgroundLine />
        <BackgroundLine />
    </g>
    </svg>;
}