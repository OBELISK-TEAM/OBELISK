import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Obelisk",
  description: "Log in to access your interactive boards",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
