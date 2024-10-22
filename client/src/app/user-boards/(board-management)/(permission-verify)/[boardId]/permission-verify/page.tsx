import React from "react";
import PermissionVerifyFailure from "@/components/board-details/board-permission-verify/PermissionVerifyFailure";
import { Card } from "@/components/ui/card";
import PermissionVerifyProcess from "@/components/board-details/board-permission-verify/PermissionVerifyProcess";
import PermissionVerifySuccess from "@/components/board-details/board-permission-verify/PermissionVerifySuccess";

const PermissionVerifyPage = () => {
  return (
    <Card
      className="w-min-full align-center flex w-full flex-col items-center justify-center gap-8"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      {/*<PermissionVerifyFailure />*/}
      {/*<PermissionVerifyProcess />*/}
      <PermissionVerifySuccess boardName="Board name" boardId="6714f7a5e00fe95f59340be1" permission="editor" />
    </Card>
  );
};

export default PermissionVerifyPage;
