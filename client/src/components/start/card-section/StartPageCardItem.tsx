"use client";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { IStartPageCard } from "@/interfaces/start-page/card";

interface CardSectionProps {
  card: IStartPageCard;
}
const fallbackImage = "/images/start-page/fallback-image.jpg";

export const StartPageCardItem = ({ card }: CardSectionProps) => {
  const [imgSrc, setImgSrc] = useState(card.imageSrc || fallbackImage);

  return (
    <div className="flex flex-1 flex-col transition-all delay-150 duration-300 md:hover:scale-110">
      {card.imageSrc && (
        <div className="relative top-2 h-[10em] w-full">
          <Image
            src={imgSrc}
            alt={card.title}
            fill
            blurDataURL={fallbackImage}
            className="object-cover"
            onError={() => {
              setImgSrc(fallbackImage);
            }}
          />
        </div>
      )}
      <Card className={`flex flex-1 flex-col gap-2 px-8 ${card.imageSrc ? "border-t-0 py-4" : "py-8"}`}>
        <CardTitle className={imgSrc ? "text-md mt-2" : "text-md text-left"}>{card.title}</CardTitle>
        <CardDescription className="leading-6">{card.description}</CardDescription>
      </Card>
    </div>
  );
};
