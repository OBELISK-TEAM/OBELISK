import React, { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BoardInfoInputItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  isEditing?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  actions?: React.ReactNode;
  id: string;
}

const BoardInfoInputItem: React.FC<BoardInfoInputItemProps> = ({
  icon,
  label,
  value,
  inputProps,
  isEditing,
  onKeyDown,
  actions,
  id,
}) => (
  <div className="mb-4 flex flex-col gap-1">
    <Label className="flex items-center text-sm font-semibold" htmlFor={id}>
      {icon}
      <span>{label}</span>
    </Label>
    <div className="flex items-center">
      <Input
        value={value}
        id={id}
        readOnly={!isEditing}
        onKeyDown={onKeyDown}
        className="h-10 w-full text-muted-foreground"
        {...inputProps}
      />
      {actions}
    </div>
  </div>
);

export default BoardInfoInputItem;
