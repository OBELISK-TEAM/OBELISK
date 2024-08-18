import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface GoogleIconProps {
    width?: number,
    height?: number
}

const GoogleIcon: React.FC<GoogleIconProps> = ({ width = 48, height = 48 }) => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div style={{width: width, height: height}} />;
    }

    const color = resolvedTheme === "dark" ? "white" : "black";
    return (
        <svg fill={color} width={width} height={height} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <title>google</title>
            <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none" />
                    <rect width="48" height="48" fill="none" />
                </g>
                <g id="icons_Q2" data-name="icons Q2">
                    <path d="M24.7,20.5v7.6H35.6a10.9,10.9,0,0,1-10.9,8,12.1,12.1,0,1,1,7.9-21.3l5.6-5.6A20,20,0,1,0,24.7,44c16.8,0,20.5-15.7,18.9-23.5Z" />
                </g>
            </g>
        </svg>
    );
}
export default GoogleIcon;