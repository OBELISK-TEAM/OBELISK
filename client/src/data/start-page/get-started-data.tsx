import { IStartPageTextSection } from "@/interfaces/start-page/text-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const getStartedData: IStartPageTextSection = {
  title: "What will you create today?",
  description:
    "Whether you're brainstorming with teammates or organising ideas on your own, Obelisk is here to simplify collaboration and bring your ideas to life with an easy-to-use online board",
  button: (
    <Link href={"auth/login"} passHref={true}>
      <Button>Start right now</Button>
    </Link>
  ),
};
