import Link from "next/link";
import { Button } from "./ui/button";

const AuthHeaderButtons: React.FC = () => {
    return (
        <div className="flex flex-row-reverse gap-3 flex-1">
            <Button variant="default" className="p-0">
                <Link href={"/auth/signup"} className="px-4 py-2">Sign up</Link>
            </Button>
            <Button variant="secondary" className="p-0">
                <Link href={"/auth/login"} className="px-4 py-2">Login</Link>
            </Button>
        </div>
    );
}

export default AuthHeaderButtons;