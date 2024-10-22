"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
const FailureScreen: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    toast.error("Permission could not be granted.");
  }, []);

  return (
    <>
      <CardHeader className={"contents"}>
        <CardTitle>Failure</CardTitle>
        <CardDescription>Unfortunately, something went wrong during the processing of your request.</CardDescription>
      </CardHeader>
      <CardContent className={"contents"}>
        <Button className="m-0 flex w-full max-w-56 items-center p-0" onClick={() => router.push("/user-boards")}>
          <ChevronLeft />
          Go back to the boards
        </Button>
      </CardContent>
    </>
  );
};

export default FailureScreen;
