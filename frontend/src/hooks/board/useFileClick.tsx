import { useEffect } from "react";

const useFileClick = (
  activeItem: string | null,
  setActiveItem: (item: string | null) => void,
  fileInputRef: React.RefObject<HTMLInputElement>,
  fileJSONInputRef: React.RefObject<HTMLInputElement>
) => {
  useEffect(() => {
    if (activeItem === "add-image-disk") {
      fileInputRef.current?.click();
      setActiveItem(null);
    } else if (activeItem === "load-images-json") {
      fileJSONInputRef.current?.click();
      setActiveItem(null);
    }
  }, [activeItem, setActiveItem, fileInputRef, fileJSONInputRef]);
};

export default useFileClick;
