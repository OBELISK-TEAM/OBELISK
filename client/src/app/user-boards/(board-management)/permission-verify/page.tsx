import React from "react";
import PermissionVerifySuccess from "@/components/board-permission-verify/PermissionVerifySuccess";
import { grantPermission } from "@/app/actions/permissionsActions";
import PermissionVerifyFailure from "@/components/board-permission-verify/PermissionVerifyFailure";
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
