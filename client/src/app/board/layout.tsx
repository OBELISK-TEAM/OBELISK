import { MenuDataProvider } from "@/contexts/MenuDataContext";
import { FileProvider } from "@/contexts/FileContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import KeydownListenerWrapper from "@/providers/KeydownListenerWrapper";
import { ZoomUIProvider } from "@/contexts/ZoomUIContext";

const SliderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ZoomUIProvider>
      <CanvasProvider>
        <UndoRedoProvider>
          <MenuDataProvider>
            <FileProvider>
              <KeydownListenerWrapper>{children}</KeydownListenerWrapper>
            </FileProvider>
          </MenuDataProvider>
        </UndoRedoProvider>
      </CanvasProvider>
    </ZoomUIProvider>
  );
};

export default SliderLayout;
