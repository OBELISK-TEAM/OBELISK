"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHandleAuth } from "@/hooks/auth/useHandleAuth";

const EmailSignupCard: React.FC = () => {
  const { email, password, error, loading, setEmail, setPassword, signup } = useHandleAuth();
  return (
    <Card className="h-1/2 w-3/5 min-w-96 border-none shadow-none">
      <CardHeader className="items-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your credentials below to create your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={signup}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="abc@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Your password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <ol className="list-disc text-sm text-red-500">
                {error.map((errMsg, index) => (
                  <li key={index}>{errMsg}</li>
                ))}
              </ol>
            )}
            <Button type="submit" disabled={loading}>
              <span className="flex items-center px-4 py-2">{loading ? "Creating account..." : "Create account"}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailSignupCard;
