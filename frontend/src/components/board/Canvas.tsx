import React from "react";
import { useSlideContext } from "@/contexts/SlideContext";

const SlideCanvas: React.FC = () => {
  const { canvasRef } = useSlideContext();
  return (
    <div className="mt-4 flex w-fit rounded-lg bg-white">
      {/* Kolor płótna nie powinien zależeć od wybranego motywu; zawsze jest biały */}
      <canvas
        ref={canvasRef}
        className="rounded-lg border"
        width={1000}
        height={550}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default SlideCanvas;
