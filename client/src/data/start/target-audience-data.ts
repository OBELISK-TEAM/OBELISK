import { IStartPageCardSection } from "@/interfaces/start-page/card-section";
export const targetAudienceData: IStartPageCardSection = {
  title: "Who is it for?",
  description: "Designed with users of (almost) all scales in mind",
  cards: [
    {
      title: "Single Users",
      description: "For creators who want a simple, flexible way to organize and share ideas.",
      imageSrc: "/images/start-page/real-time-collaboration.jpg",
    },
    {
      title: "Small Teams",
      description: "Collaborate seamlessly on shared boards to enhance teamwork and keep projects organized.",
      imageSrc: "/images/start-page/small-teams.jpg",
    },
    {
      title: "Medium Teams",
      description: "A solution built for small-to-mid-sized groups, fostering creativity and productivity.",
      imageSrc: "/images/start-page/medium-teams.jpg",
    },
  ],
};
