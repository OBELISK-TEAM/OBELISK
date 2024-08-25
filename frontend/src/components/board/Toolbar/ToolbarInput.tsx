import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import StyledLabel from "@/components/board/Toolbar/ToolbarLabel";

interface ToolbarInputPropsI {
  styleKey: string;
  labelText: string;
  inputType?: string;
  value: string | number | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ToolbarInput: React.FC<ToolbarInputPropsI> = ({ styleKey, labelText, inputType = "text", value, onChange }) => (
  <div className={`flex items-center space-x-2 border-r pr-4`}>
    <StyledLabel htmlFor={styleKey}>{labelText}</StyledLabel>
    <Input
      type={inputType}
      id={styleKey}
      className={inputType === "color" ? "h-5 w-5 rounded-full p-0" : "w-[5.5em]"}
      value={value || ""}
      onChange={onChange}
    />
  </div>
);

export default ToolbarInput;
