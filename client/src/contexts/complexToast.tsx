import { ToastTypes } from "@/enums/ToastType";
import React from "react";
import { ToasterProps, toast } from "sonner";

/**
 * The function show the user a notification / toast / sonner.
 * @param toastType
 * @param toastDescription Toast notification content
 * @param toasterProps Properties passed into the toast further
 * @param toastTitle If this argument is undefined, the `toastType` value serves as a title
 */
export const complexToast = (
  toastType: ToastTypes,
  toastDescription: string | string[],
  toasterProps?: ToasterProps,
  toastTitle?: string
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

  const title = toastTitle ? toastTitle : toastType;

  switch (toastType) {
    case ToastTypes.SUCCESS:
      toast.success(title, { ...toasterProps, description: description });
      break;
    case ToastTypes.ERROR:
      toast.error(title, { ...toasterProps, description: description });
      break;
    case ToastTypes.INFO:
      toast.info(title, { ...toasterProps, description: description });
      break;
    case ToastTypes.WARNING:
      toast.warning(title, { ...toasterProps, description: description });
      break;
  }
};
