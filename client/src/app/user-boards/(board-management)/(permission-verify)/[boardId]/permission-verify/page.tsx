import React from "react";
import PermissionVerifyFailure from "@/components/board-details/board-permission-verify/PermissionVerifyFailure";
import { Card } from "@/components/ui/card";
import PermissionVerifyProcess from "@/components/board-details/board-permission-verify/PermissionVerifyProcess";
import PermissionVerifySuccess from "@/components/board-details/board-permission-verify/PermissionVerifySuccess";

interface PermissionVerifyPageProps {
  params: {
    boardId: string;
  };
}
const PermissionVerifyPage = ({ params }: PermissionVerifyPageProps) => {
  return (
    <Card
      className="w-min-full align-center flex w-full flex-col items-center justify-center gap-8"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <PermissionVerifyFailure />
      {/*<PermissionVerifyProcess />*/}
      {/*<PermissionVerifySuccess boardName="Board name" boardId={params.boardId} permission="editor" />*/}
    </Card>
  );
};

export default PermissionVerifyPage;
