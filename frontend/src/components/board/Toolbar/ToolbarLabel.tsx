import { FC } from "react";

interface ButtonLabelPropsI {
  className?: string;
  htmlFor?: string;
  label?: string;
  children?: React.ReactNode;
}

const StyledLabel: FC<ButtonLabelPropsI> = ({ children, className, htmlFor, label }) => {
  let classes =
    "flex items-center text-sm font-medium text-left text-muted-foreground hover:text-primary hover:bg-muted p-2 rounded relative group-hover:w-full cursor-pointer";
  if (className) {
    classes += ` ${className}`;
  }
  return (
    <label className={classes} htmlFor={htmlFor}>
      {label}
      {children}
    </label>
  );
};

export default StyledLabel;
