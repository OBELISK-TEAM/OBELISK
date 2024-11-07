import { IStartPageTextSection } from "@/interfaces/start-page/text-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const getStartedData: IStartPageTextSection = {
  title: "What will you create today?",
  description:
    "Whether you're brainstorming with teammates or organizing ideas solo, Obelisk is here to simplify collaboration and bring your ideas to life.",
  button: (
    <Link href={"auth/login"} passHref={true}>
      <Button>Start right now</Button>
    </Link>
  ),
};
