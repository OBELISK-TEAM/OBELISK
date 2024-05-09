import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const CallToAction: React.FC = () => {
  const imageUrl = "https://picsum.photos/800/600"; // Using a random image from Lorem Picsum

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] pt-[3em] bg-palette1-darkest-blue-template1 text-palette1-creme-light relative bottom-[50px] lg:bottom-[100px]">
      <h2 className="text-5xl font-bold mb-4 text-#292929" style={{letterSpacing:'1.8px'}}>Join Us!</h2>
      <div className="relative w-64 h-64 mb-8 rounded-lg overflow-hidden border-2 border-palette1-creme-strong object-cover">
        <Image
          src={imageUrl}
          alt="Join Us"
          quality={75}
          fill={true}
        />
      </div>

      <Button variant="gold" className="text-2xl px-12" style={{padding: "1.06em 3.2em 0.9em",lineHeight: "20rem"}}>
        Get Started!
      </Button>
    </section>
  );
};

export default CallToAction;
