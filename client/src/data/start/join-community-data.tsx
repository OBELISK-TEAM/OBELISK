import { ITextSection } from "@/interfaces/start-page/text-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const joinCommunityData: ITextSection = {
  title: "Interested? Get started today",
  description:
    "Join the growing community of teams, creators, and organizations using Obelisk to work better together.",
  button: (
    <Link href={"auth/signup"} passHref={true}>
      <Button>Start now for free</Button>
    </Link>
  ),
};
