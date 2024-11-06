import { ICardSection } from "@/interfaces/start-page/card-section";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
interface CardSectionProps {
  cardSection: ICardSection;
}
export const CardSection = ({ cardSection }: CardSectionProps) => {
  const { title, description, cards } = cardSection;
  return (
    <Card className="flex flex-col items-center gap-10 border-none">
      <div className={"flex flex-col items-center gap-2"}>
        <CardTitle className={"text-4xl"}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className={"flex flex-col justify-between gap-10 xl:flex-row"}>
        {cards.map((card, index) => (
          <div key={index} className="flex flex-1 flex-col">
            {card.imageSrc && (
              <div className="relative top-2 h-[10em] w-full">
                <Image src={card.imageSrc} alt={card.title} fill className="object-cover" />
              </div>
            )}
            <Card className={"flex flex-1 flex-col gap-2 px-8 " + (card.imageSrc ? "border-t-0 py-4" : "py-8")}>
              <CardTitle className={card.imageSrc ? "text-md text-center" : "text-md"}>{card.title}</CardTitle>
              <CardDescription className="leading-6">{card.description}</CardDescription>
            </Card>
          </div>
        ))}
      </div>
    </Card>
  );
};
