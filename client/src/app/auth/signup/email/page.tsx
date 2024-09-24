"use client";
import AuthHeaderButtons from "@/components/user-boards/AuthHeaderButtons";
import ExpandedLogoAbbreviation from "@/components/user-boards/ExpandedLogoAbbreviation";
import EmailSignupCard from "./EmailSignupCard";

const SignupWithEmail: React.FC = () => {
  return (
    <div className="h-min-[100vh] flex h-[100vh]">
      <div className="h-min-[100vh] hidden h-[100vh] w-full flex-1 flex-row items-center justify-center bg-primary text-primary-foreground lg:flex">
        <ExpandedLogoAbbreviation />
      </div>
      <div className="flex-1 bg-background text-foreground">
        <div className="flex h-full w-full flex-col justify-between gap-3 p-6 align-middle">
          <AuthHeaderButtons />
          <div className="flex justify-center">
            <EmailSignupCard />
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupWithEmail;
