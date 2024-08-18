import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface AppLogoProps {
    width: number,
    height: number,
    alt?: string
}

export const AppLogo: FC<AppLogoProps> = ({ width, height, alt }) => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => setMounted(true), [])

    // If the theme hasn't been resolved yet, don't render anything to prevent server-client mismatches during hydration
    if (!mounted) {
        return <div style={{width: width, height: height}} />;
    }

    return (
        <Image
            src={resolvedTheme === "dark" ? "/logo-lite-darkTheme.png" : "/logo-lite-lightTheme.png"}
            alt={alt ? alt : "Logo"}
            width={width}
            height={height}
        />
    );
}