import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup | Obelisk",
  description: "Sign up and start creating interactive boards.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
