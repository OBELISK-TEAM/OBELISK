import React from "react";
import { Card } from "@/components/ui/card";
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
      <PermissionVerifySuccess boardName="Board name" boardId={"6716f1fff8ab7c0c56aaabe5"} permission="editor" />
    </Card>
  );
};

export default PermissionVerifyPage;
