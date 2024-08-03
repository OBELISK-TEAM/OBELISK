import Image from "next/image";
import googleIconSvg from "../../../public/non-lucid-icons/google-icon.svg";


interface GoogleIconProps {
    width?: number,
    height?: number
}

const GoogleIcon: React.FC<GoogleIconProps> = ( {width, height} ) => {
    return (
        <Image src={googleIconSvg} alt="Google icon" width={width} height={height} />
    )
}

export default GoogleIcon;