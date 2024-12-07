import { cn } from "@/lib/utils";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";

interface SummaryCardProps {
  value: string;
  description: string;
  className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ value, description, className }) => {
  return (
    <Card className={cn("flex w-fit flex-col items-center justify-center p-6", className)}>
      <CardHeader className={"p-0 text-4xl font-extrabold text-primary"}>{value}</CardHeader>
      <CardDescription className="text-md m-0 max-w-[320px] text-muted-foreground">{description}</CardDescription>
    </Card>
  );
};
