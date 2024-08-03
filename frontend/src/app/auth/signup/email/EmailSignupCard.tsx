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

const EmailSignupCard: React.FC = () => {
    return (
        <Card className="h-1/2 w-3/5 min-w-96 shadow-none border-none">
            <CardHeader className="items-center">
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your credentials below to create your account</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="abc@example.com" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" placeholder="Your password" type="password" />
                        </div>
                        <Button type="submit">
                            <Link href="#" className="px-4 py-2 flex items-center">Create account</Link>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default EmailSignupCard; 