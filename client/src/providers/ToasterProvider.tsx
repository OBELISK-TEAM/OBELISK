import { Toaster } from "@/components/ui/toaster";
import React, { FC } from "react";
import { ToasterProps } from "sonner";

const ToastWrapper: FC = () => {
  const toastsConfig: ToasterProps = {
    position: "bottom-center",
    richColors: true,
    visibleToasts: 5,
    closeButton: true,
  };

  return <Toaster {...toastsConfig} />;
};

export default ToastWrapper;
