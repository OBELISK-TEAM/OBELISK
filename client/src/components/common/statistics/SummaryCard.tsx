import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  value: string;
  description: string;
  className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ value, description, className }) => {
  return (
    <Card className={cn("w-full p-6 text-center", className)}>
      <CardHeader>
        <h2 className="text-4xl font-extrabold text-primary">{value}</h2>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
    </Card>
  );
};
