import logger from "@/lib/logger";
import { CardSection } from "@/components/start/card-section/CardSection";
import { usefulCapabilitiesData } from "@/data/start/useful-capabilities-section";
import { targetAudienceData } from "@/data/start/target-audience-data";
import { toolFeaturesData } from "@/data/start/tool-features-data";

const Home = () => {
  logger.log("Redirecting to /user-boards");
  //redirect("/user-boards");
  // todo: JIRA[OK-39] - create a home page
  // return (
  //   <div className="flex">
  //     <div className="flex-grow p-10">
  //       <h1>Online Board for Effective Learning, Interaction and Sharing Knowledge</h1>
  //       <p>We Are The Future...</p>
  //       <button className="rounded-lg bg-blue-500 p-3 text-white">Get Started!</button>
  //     </div>
  //   </div>
  // );

  return (
    <main className={"flex flex-col gap-20 p-2 py-10 lg:p-32 2xl:p-64"}>
      <CardSection cardSection={usefulCapabilitiesData} />
      <CardSection cardSection={targetAudienceData} />
      <CardSection cardSection={toolFeaturesData} />
    </main>
  );
};

export default Home;
