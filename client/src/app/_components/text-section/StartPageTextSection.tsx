import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { IStartPageTextSection } from "@/interfaces/start-page/text-section";
interface TextSectionProps {
  textSection: IStartPageTextSection;
}
export const StartPageTextSection = ({ textSection }: TextSectionProps) => {
  const { title, description, button } = textSection;
  return (
    <Card className="flex max-w-[80%] flex-col items-center gap-10 border-none text-center font-bold shadow-none">
      <CardTitle className={"text-4xl"}>{title}</CardTitle>
      <CardDescription className={"text-xl"}>{description}</CardDescription>
      {button}
    </Card>
  );
};
