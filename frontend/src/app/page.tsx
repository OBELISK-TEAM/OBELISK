import Image from "next/image";
import CallToAction from "../components/startpage/JoinUs";
import NextSteps from "../components/startpage/NextSteps";
import MissionStatement from "../components/startpage/MissionStatement";
import Header from "../components/startpage/Header";

export default function Home() {
  return (
    <>
    <Header />
    <MissionStatement />
    <NextSteps />
   <CallToAction />
   </>
  );
}
