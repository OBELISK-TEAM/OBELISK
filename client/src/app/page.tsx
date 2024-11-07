import { CardSection } from "@/components/start/card-section/CardSection";
import { TextSection } from "@/components/start/text-section/TextSection";
import { usefulCapabilitiesData } from "@/data/start/useful-capabilities-section";
import { targetAudienceData } from "@/data/start/target-audience-data";
import { toolFeaturesData } from "@/data/start/tool-features-data";
import { getStartedData } from "@/data/start/get-started-data";
import { joinCommunityData } from "@/data/start/join-community-data";
import Header from "@/components/main-header/Header";
import HexagonLayout from "@/components/start/hexagons-section/HexagonLayout";
import AnimatedSection from "@/components/start/animated-section/AnimatedSection";

const Home = () => {
  return (
    <>
      <div className={"block"}>
        <Header />
      </div>
      <main className={"flex flex-col items-center gap-20 p-2 py-10 pb-24 lg:px-32 2xl:px-64"}>
        <AnimatedSection>
          <TextSection textSection={getStartedData} />
        </AnimatedSection>
        <AnimatedSection>
          <CardSection cardSection={usefulCapabilitiesData} />
        </AnimatedSection>
        <AnimatedSection>
          <CardSection cardSection={targetAudienceData} />
        </AnimatedSection>
        <AnimatedSection>
          <CardSection cardSection={toolFeaturesData} />
        </AnimatedSection>
        <AnimatedSection>
          <HexagonLayout />
        </AnimatedSection>
        <AnimatedSection>
          <TextSection textSection={joinCommunityData} />
        </AnimatedSection>
      </main>
    </>
  );
};

export default Home;
