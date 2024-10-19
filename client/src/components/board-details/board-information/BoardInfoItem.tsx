import React, { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BoardInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  isEditing?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  actions?: React.ReactNode;
}

const BoardInfoItem: React.FC<BoardInfoItemProps> = ({
  icon,
  label,
  value,
  inputProps,
  isEditing,
  onKeyDown,
  actions,
}) => (
  <div className="mb-4 flex flex-col gap-1">
    <div className="flex items-center">
      {icon}
      <Label className="text-sm font-semibold">{label}</Label>
    </div>
    <div className="flex items-center">
      <Input
        value={value}
        readOnly={!isEditing}
        onKeyDown={onKeyDown}
        className="h-10 w-full text-muted-foreground"
        {...inputProps}
      />
      {actions}
    </div>
  </div>
);

export default BoardInfoItem;
