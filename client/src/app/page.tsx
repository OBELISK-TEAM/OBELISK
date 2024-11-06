import { CardSection } from "@/components/start/card-section/CardSection";
import { TextSection } from "@/components/start/text-section/TextSection";
import { usefulCapabilitiesData } from "@/data/start/useful-capabilities-section";
import { targetAudienceData } from "@/data/start/target-audience-data";
import { toolFeaturesData } from "@/data/start/tool-features-data";
import { getStartedData } from "@/data/start/get-started-data";
import { joinCommunityData } from "@/data/start/join-community-data";

const Home = () => {
  return (
    <main className={"flex flex-col items-center gap-20 p-2 py-10 pb-24 lg:px-32 2xl:px-64"}>
      <TextSection textSection={getStartedData} />
      <CardSection cardSection={usefulCapabilitiesData} />
      <CardSection cardSection={targetAudienceData} />
      <CardSection cardSection={toolFeaturesData} />
      <TextSection textSection={joinCommunityData} />
    </main>
  );
};

export default Home;
