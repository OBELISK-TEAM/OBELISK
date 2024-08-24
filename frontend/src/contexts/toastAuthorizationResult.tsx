import { ToastTypes } from "@/enums/ToastType";
import React from "react";
import { toast } from "sonner";

export const toastAuthorizationResult = (
  toastType: ToastTypes,
  toastTitle: string,
  toastDescription: string | string[]
): void => {
  const description: string | React.JSX.Element =
    typeof toastDescription === "string" ? (
      toastDescription
    ) : (
      <ul>
        {toastDescription.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    );

  switch (toastType) {
    case ToastTypes.SUCCESS:
      toast.success(toastTitle, { description: description });
      break;
    case ToastTypes.ERROR:
      toast.error(toastTitle, { description: description });
      break;
    case ToastTypes.INFO:
      toast.info(toastTitle, { description: description });
      break;
    case ToastTypes.WARNING:
      toast.warning(toastTitle, { description: description });
      break;
  }
};


