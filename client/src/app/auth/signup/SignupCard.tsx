"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleIcon from "@/components/non-lucid-icons/GoogleIcon";
import { Mail } from "lucide-react";
import { useHandleAuth } from "@/hooks/auth/useHandleAuth";
import React from "react";

const SignupCard: React.FC = () => {
  const { googleAuth, loading } = useHandleAuth();
  return (
    <Card className="h-1/2 w-3/5 min-w-96 border-none shadow-none">
      <CardHeader className="items-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Choose a way to create an account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Link href="/auth/signup/email" className="flex" onClick={(e) => (loading ? e.preventDefault() : null)}>
          <Button className="flex-1" disabled={loading}>
            <Mail />
            &ensp;Sign up with email
          </Button>
        </Link>

        <div className="flex items-center gap-1.5">
          <Separator className="flex-1" />
          <p className="font-medium text-muted-foreground" style={{ fontSize: "12px" }}>
            OR CONTINUE WITH
          </p>
          <Separator className="flex-1" />
        </div>
        <Button variant="outline" className="flex-1" onClick={googleAuth} disabled={loading}>
          <GoogleIcon width={16} height={16} />
          &ensp;Google
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignupCard;
