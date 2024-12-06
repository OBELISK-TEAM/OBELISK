import { FC } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { Input } from "@/components/ui/input";

interface TimeInputProps {
  value?: Date;
  onChange: (date: Date) => void;
}

export const TimeInput: FC<TimeInputProps> = ({ value, onChange }) => {
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) {
      return;
    }

    const [hours, minutes] = event.target.value.split(":").map(Number);
    const updatedDate = setMinutes(setHours(value, hours), minutes);
    onChange(updatedDate);
  };

  return (
    <Input
      type="time"
      className="rounded border p-2"
      value={value ? format(value, "HH:mm") : ""}
      onChange={handleTimeChange}
    />
  );
};
