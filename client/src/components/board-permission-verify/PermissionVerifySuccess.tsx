"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { capitalizeFirstLetter } from "@/lib/stringConverter";
import { VerifyPermissionResponse } from "@/interfaces/responses/board-permission/verify-permission-response";

interface PermissionVerifySuccessProps {
  response: VerifyPermissionResponse;
}

const PermissionVerifySuccess = ({ response }: PermissionVerifySuccessProps) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(10);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    toast.success("Permission granted successfully!");
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push(`/user-boards/${response.boardId}/slides/1`);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [countdown, response.boardId]);

  return (
    <Card
      className="w-min-full align-center flex w-full flex-col items-center justify-center gap-8"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <CardHeader className={"contents"}>
        <CardTitle>Success</CardTitle>
        <CardDescription>
          You have been granted the <span className={"text-primary"}>{capitalizeFirstLetter(response.permission)}</span>{" "}
          permission for the board <span className={"text-primary"}>{response.name}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {countdown === 0 ? "Redirecting to the board..." : `Redirecting to the board in ${countdown}...`}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <Button variant="secondary" className="flex w-56 items-center" onClick={() => router.push("/user-boards")}>
          <ChevronLeft />
          Go back to the dashboard
        </Button>
        <Button
          className="flex w-56 items-center"
          onClick={() => router.push(`/user-boards/${response.boardId}/slides/1`)}
        >
          <ChevronRight />
          Go to the board
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PermissionVerifySuccess;
