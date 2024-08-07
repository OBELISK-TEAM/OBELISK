"use client";
import AuthHeaderButtons from "@/components/AuthHeaderButtons";
import ExpandedLogoAbbreviation from "@/components/ExpandedLogoAbbreviation";
import SignupCard from "./SignupCard";

const SignupMethods: React.FC = () => {
  return (
    <div className="flex h-min-[100vh] h-[100vh]">
      <div className="w-full h-min-[100vh] h-[100vh] flex-1 bg-muted text-muted-foreground hidden lg:flex flex-row items-center justify-center">
        <ExpandedLogoAbbreviation />
      </div>
      <div className="bg-background text-foreground flex-1">
        <div className="w-full h-full justify-between flex flex-col gap-3 p-6 align-middle">
          <AuthHeaderButtons />
          <div className="flex justify-center">
            <SignupCard />
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupMethods;
