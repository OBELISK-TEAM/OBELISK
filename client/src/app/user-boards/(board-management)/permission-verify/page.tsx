import React from "react";
import PermissionVerifySuccess from "@/app/user-boards/(board-management)/permission-verify/_components/PermissionVerifySuccess";
import { grantPermission } from "@/app/actions/permissionsActions";
import PermissionVerifyFailure from "@/app/user-boards/(board-management)/permission-verify/_components/PermissionVerifyFailure";
import { GrantPermissionResponse } from "@/interfaces/responses/board-permission/grant-permission-response";
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const PermissionVerifyPage = async ({ searchParams }: PageProps) => {
  const code = searchParams.code as string;
  let response: GrantPermissionResponse;
  try {
    response = await grantPermission(code);
  } catch (error: any) {
    return <PermissionVerifyFailure />;
  }

  return <PermissionVerifySuccess response={response} />;
};

export default PermissionVerifyPage;
