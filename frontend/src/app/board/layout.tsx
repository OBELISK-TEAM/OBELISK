import { MenuDataProvider } from "@/contexts/MenuDataContext";
import { FileProvider } from "@/contexts/FileContext";
import { CanvasProvider } from "@/contexts/CanvasContext";

const SliderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <CanvasProvider>
      <MenuDataProvider>
        <FileProvider>{children}</FileProvider>
      </MenuDataProvider>
    </CanvasProvider>
  );
};

export default SliderLayout;
