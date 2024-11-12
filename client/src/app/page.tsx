import { StartPageCardSection } from "@/app/_components/card-section/StartPageCardSection";
import { StartPageTextSection } from "@/app/_components/text-section/StartPageTextSection";
import { usefulCapabilitiesData } from "@/data/start/useful-capabilities-section";
import { targetAudienceData } from "@/data/start/target-audience-data";
import { toolFeaturesData } from "@/data/start/tool-features-data";
import { getStartedData } from "@/data/start/get-started-data";
import { joinCommunityData } from "@/data/start/join-community-data";
import Header from "@/components/common/headers/main-header/Header";
import HexagonsSection from "@/app/_components/hexagons-section/StartPageHexagonsSection";
import StartPageAnimatedSection from "@/app/_components/animated-section/StartPageAnimatedSection";
import { hexagonsData } from "@/data/start/hexagons-data";

const Home = () => {
  return (
    <>
      <div className={"block"}>
        <Header />
      </div>
      <main className={"flex flex-col items-center gap-20 p-2 py-10 pb-24 lg:px-32 2xl:px-64"}>
        <StartPageAnimatedSection>
          <StartPageTextSection textSection={getStartedData} />
        </StartPageAnimatedSection>
        <StartPageAnimatedSection>
          <StartPageCardSection cardSection={usefulCapabilitiesData} />
        </StartPageAnimatedSection>
        <StartPageAnimatedSection>
          <StartPageCardSection cardSection={targetAudienceData} />
        </StartPageAnimatedSection>
        <StartPageAnimatedSection>
          <StartPageCardSection cardSection={toolFeaturesData} />
        </StartPageAnimatedSection>
        <StartPageAnimatedSection>
          <HexagonsSection hexagonsSection={hexagonsData} />
        </StartPageAnimatedSection>
        <StartPageAnimatedSection>
          <StartPageTextSection textSection={joinCommunityData} />
        </StartPageAnimatedSection>
      </main>
    </>
  );
};

export default Home;
