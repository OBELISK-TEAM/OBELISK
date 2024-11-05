"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BoardPermissionsSelect from "@/components/board-details/board-permissions/BoardPermissionsSelect";
import { BoardPermission } from "@/enums/BoardPermission";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { toast } from "sonner";
//import { ClipboardIcon, CopyIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { generatePermissionCode } from "@/app/actions/permissionsActions";
import { GeneratePermissionCodeResponse } from "@/interfaces/responses/board-permission/generate-permission-code-response";
import { formatDuration } from "@/lib/dateUtils";
//import logger from "@/lib/logger";
import { Badge } from "@/components/ui/badge";

interface ShareBoardDialogProps {
  boardId: string;
  children: React.ReactNode;
}

const ShareBoardDialog: React.FC<ShareBoardDialogProps> = ({ boardId, children }) => {
  const [isPending, startTransition] = useTransition();
  const [permission, setPermission] = useState<BoardPermission>(BoardPermission.EDITOR);
  const [response, setResponse] = useState<GeneratePermissionCodeResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const generateLink = async () => {
    startTransition(async () => {
      try {
        const apiResponse = await generatePermissionCode(boardId, permission);
        setResponse({
          ...apiResponse,
          permissionStr: `${window.location.origin}/user-boards/permission-verify?code=${apiResponse.permissionStr}`,
        });
        toast.success("Link has been successfully generated!");
      } catch (error: any) {
        const errorMessage = error.message || "An error occurred while generating the link.";
        toast.error(errorMessage);
      }
    });
  };

  // const handleCopyLink = async () => {
  //   try {
  //     //await navigator.clipboard.writeText(response?.permissionStr || ""); not working on deployed version
  //     logger.warn(response?.permissionStr);
  //     toast.info("Link copied to clipboard");
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 4000);
  //   } catch {
  //     toast.error("Failed to copy the link");
  //   }
  // };

  const resetForm = () => {
    setResponse(null);
    setCopied(false);
    setPermission(BoardPermission.EDITOR);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex-col gap-10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share the board with others</DialogTitle>
          <DialogDescription>Generate an invitation link and send it to others</DialogDescription>
        </DialogHeader>

        {!response && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="permission" className="w-48">
                Permission
              </label>
              <BoardPermissionsSelect
                boardMemberPermission={permission}
                className="w-48"
                onChange={(newPermission) => setPermission(newPermission)}
              />
            </div>
            <Button onClick={generateLink} disabled={isPending} className="w-full">
              {isPending ? <LoadingSpinner /> : "Generate link with invitation"}
            </Button>
          </div>
        )}

        {response && (
          <div className="flex flex-col gap-4">
            <DialogDescription>
              The link granting <strong>{permission.toLowerCase()}</strong> permission has been successfully generated.
              Copy it and send it to other users. The link will be active for{" "}
              <em>{formatDuration(response.ttlInMs)}</em>.
            </DialogDescription>

            <HoverCard openDelay={100} closeDelay={200}>
              <HoverCardTrigger>
                <Badge
                  variant="secondary"
                  className="flex h-fit w-full gap-2 whitespace-normal break-words rounded-md p-2"
                  // onClick={handleCopyLink}
                >
                  {response.permissionStr}
                  {/*{copied ? <ClipboardIcon /> : <CopyIcon />}*/}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent>{copied ? "Copy again" : "Copy this text"}</HoverCardContent>
            </HoverCard>

            <Button onClick={resetForm} variant="ghost" className="mt-4 self-end">
              Reset
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareBoardDialog;
