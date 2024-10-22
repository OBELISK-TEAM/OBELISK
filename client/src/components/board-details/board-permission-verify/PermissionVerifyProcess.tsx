import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";

const PermissionVerifyProcessing: React.FC = () => {
  return (
    <>
      <CardHeader className={"contents"}>
        <CardTitle>Please, wait a moment...</CardTitle>
        <CardDescription>We are processing your invitation link.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="scale-150 transform">
          <LoadingSpinner />
        </div>
      </CardContent>
    </>
  );
};

export default PermissionVerifyProcessing;
