import { IStartPageCardSection } from "@/interfaces/start-page/card-section";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { StartPageCardItem } from "@/components/start/card-section/StartPageCardItem";

interface CardSectionProps {
  cardSection: IStartPageCardSection;
}
export const StartPageCardSection = ({ cardSection }: CardSectionProps) => {
  const { title, description, cards } = cardSection;
  return (
    <Card className="flex flex-col items-center gap-10 border-none shadow-none">
      <div className="flex flex-col items-center gap-2">
        <CardTitle className="text-4xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="flex flex-col justify-between gap-10 xl:flex-row">
        {cards.map((card, index) => (
          <StartPageCardItem key={index} card={card} />
        ))}
      </div>
    </Card>
  );
};
