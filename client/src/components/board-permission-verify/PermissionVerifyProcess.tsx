import React from "react";
import { CardContent, CardHeader, CardTitle, CardDescription, Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";

const PermissionVerifyProcessing: React.FC = () => {
  return (
    <Card
      className="w-min-full align-center flex w-full flex-col items-center justify-center gap-8"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <CardHeader className={"contents"}>
        <CardTitle>Please, wait a moment...</CardTitle>
        <CardDescription>We are processing your invitation link.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="scale-150 transform">
          <LoadingSpinner />
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionVerifyProcessing;
