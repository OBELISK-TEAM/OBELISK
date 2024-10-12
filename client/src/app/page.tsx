import { redirect } from "next/navigation";
import logger from "@/lib/logger";
const Home = () => {
  logger.log("Redirecting to /user-boards");
  redirect("/user-boards");
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
};

export default Home;
