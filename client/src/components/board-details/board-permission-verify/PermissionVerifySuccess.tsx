"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { capitalizeFirstLetter } from "@/lib/stringConverter";

interface SuccessScreenProps {
  boardName: string;
  boardId: string;
  permission: string;
}

const PermissionVerifySuccess: React.FC<SuccessScreenProps> = ({ boardName, boardId, permission }) => {
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
      router.push(`/user-boards/${boardId}/slides/1`);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [countdown, boardId]);

  return (
    <>
      <CardHeader className={"contents"}>
        <CardTitle>Success</CardTitle>
        <CardDescription>
          You have been granted the <span className={"text-primary"}>{capitalizeFirstLetter(permission)}</span>{" "}
          permission for the board <span className={"text-primary"}>{boardName}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {countdown === 0 ? "Redirecting to the board..." : `Redirecting to the board in ${countdown}...`}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          className="flex w-56 items-center justify-between"
          onClick={() => (window.location.href = "/user-boards")}
        >
          <ChevronLeft />
          Go back to the dashboard
        </Button>
        <Button
          className="flex w-56 items-center justify-between"
          onClick={() => router.push(`/boards/${boardId}/slides/1`)}
        >
          <ChevronRight />
          Go to the board
        </Button>
      </CardFooter>
    </>
  );
};

export default PermissionVerifySuccess;
