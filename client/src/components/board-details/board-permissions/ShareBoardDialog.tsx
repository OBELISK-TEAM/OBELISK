import React, { useState } from "react";
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
import { GrantPermissionLinkState } from "@/enums/GrantPermissionLinkState";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { toast } from "sonner";
import { ClipboardIcon, CopyIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const ShareBoardDialog = ({ children }: { children: React.ReactNode }) => {
  const [linkState, setLinkState] = useState<GrantPermissionLinkState>(GrantPermissionLinkState.Idle);
  const [permission, setPermission] = useState<BoardPermission>(BoardPermission.EDITOR);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const generateLink = () => {
    setLinkState(GrantPermissionLinkState.Loading);
    setTimeout(() => {
      setGeneratedLink(`http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/costamcos4tam`);
      setLinkState(GrantPermissionLinkState.Generated);
    }, 2000);
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast.info("Link copied to clipboard");
      setCopied(true);
    } catch (error) {
      toast.error("Failed to copy the link");
      setCopied(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex-col gap-10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share the board with others</DialogTitle>
          <DialogDescription>Generate an invitation link and send it to others</DialogDescription>
        </DialogHeader>

        {linkState !== GrantPermissionLinkState.Generated && (
          <div className={"contents"}>
            <div className={"flex w-fit flex-col gap-1"}>
              <p className={"w-48"}>Permission</p>
              <BoardPermissionsSelect
                currentPermission={permission}
                className="w-48"
                onChange={(newPermission) => setPermission(newPermission)}
              />
            </div>
            <Button onClick={generateLink} disabled={linkState === GrantPermissionLinkState.Loading} className="w-full">
              {linkState === GrantPermissionLinkState.Loading ? <LoadingSpinner /> : "Generate link with invitation"}
            </Button>
          </div>
        )}

        {linkState === GrantPermissionLinkState.Generated && (
          <div className={"contents"}>
            <DialogDescription>
              The link granting <strong>{permission.toLowerCase()}</strong> permission has been generated successfully.
              Copy it and send it to other users. The link will be active for <em>{"{time}"}</em>.
            </DialogDescription>

            <HoverCard openDelay={100} closeDelay={200}>
              <HoverCardTrigger>
                <Button variant="secondary" className="flex w-full gap-2" onClick={handleCopyLink}>
                  {generatedLink}
                  {copied ? <ClipboardIcon /> : <CopyIcon />}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent>{copied ? "copy again" : "click to copy"}</HoverCardContent>
            </HoverCard>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareBoardDialog;
