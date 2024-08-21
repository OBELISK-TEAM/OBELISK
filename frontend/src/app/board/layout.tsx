import { SlideProvider } from "@/contexts/SlideContext";

const SliderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <SlideProvider>{children}</SlideProvider>;
};

export default SliderLayout;
