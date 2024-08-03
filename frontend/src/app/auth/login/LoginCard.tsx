import GoogleIcon from "@/components/non-lucid-icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const LoginCard: React.FC = () => {
    return (
        <Card className="h-1/2 w-3/5 min-w-96 shadow-none border-none">
            <CardHeader className="items-center">
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your email and password below to log into the app</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="abc@example.com" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <div className="flex justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="text-sm font-medium leading-none underline">Forgot your password?</Link>
                            </div>
                            <Input id="password" placeholder="Your password" type="password" />
                        </div>
                        <Button type="submit">Log in</Button>
                    </div>
                </form>
                <div className="flex justify-center">
                    <p className="text-sm font-medium">Don't have an account?&ensp;</p>
                    <Link href="/auth/signup" className="text-sm font-medium underline">Sign up</Link>
                </div>
                <div className="flex items-center gap-1.5">
                    <Separator className="flex-1" />
                    <p className="text-muted-foreground font-medium" style={{ fontSize: "12px" }}>OR LOG IN WITH</p>
                    <Separator className="flex-1" />
                </div>
                <Button variant="outline"><GoogleIcon width={16} height={16} /> &ensp;Google</Button>
            </CardContent>
        </Card>
    );
}

export default LoginCard;