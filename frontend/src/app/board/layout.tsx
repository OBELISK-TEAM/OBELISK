import { MenuDataProvider } from "@/contexts/MenuDataContext";
import { FileProvider } from "@/contexts/FileContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import KeydownListenerWrapper from "@/providers/KeydownListenerWrapper";
import { ZoomProvider } from "@/contexts/ZoomContext";

const SliderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ZoomProvider>
      <CanvasProvider>
        <UndoRedoProvider>
          <MenuDataProvider>
            <FileProvider>
              <KeydownListenerWrapper>{children}</KeydownListenerWrapper>
            </FileProvider>
          </MenuDataProvider>
        </UndoRedoProvider>
      </CanvasProvider>
    </ZoomProvider>
  );
};

export default SliderLayout;
