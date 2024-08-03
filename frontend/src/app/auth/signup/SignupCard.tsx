import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import GoogleIcon from "@/components/non-lucid-icons/GoogleIcon";
import { Mail } from "lucide-react";

const SignupCard: React.FC = () => {
    return (
        <Card className="h-1/2 w-3/5 min-w-96 shadow-none border-none">
            <CardHeader className="items-center">
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Choose a way to create an account</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Link href="/auth/signup/email" className="flex">
                    <Button className="flex-1">
                        <Mail />&ensp;Sign up with email
                    </Button>
                </Link>
                <div className="flex items-center gap-1.5">
                    <Separator className="flex-1" />
                    <p className="text-muted-foreground font-medium" style={{ fontSize: "12px" }}>OR CONTINUE WITH</p>
                    <Separator className="flex-1" />
                </div>
                <Link href="/auth/signup/email" className="flex">
                    <Button variant="outline" className="flex-1">
                        <GoogleIcon width={16} height={16} />&ensp;Google
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

export default SignupCard;