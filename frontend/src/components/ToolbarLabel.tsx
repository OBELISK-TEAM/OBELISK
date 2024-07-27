import { FC } from "react";

interface ButtonLabelProps {

  className?:string;
  htmlFor?:string;
  label?:string;
  children?:React.ReactNode;
}

const StyledLabel: FC<ButtonLabelProps> = ({ children,className,htmlFor,label }) => {
  let classes = "flex items-center text-left text-gray-600 hover:bg-gray-200 p-2 rounded relative group-hover:w-full hover:text-black cursor-pointer";
  if(className){
    classes += ` ${className}`;
  }
  return (
    <label
      className={classes}
      style={{ fontSize: '14px', fontWeight: '500' }}
      htmlFor={htmlFor}
    >
      {label}
      {children}
    </label>
  );
};

export default StyledLabel;
