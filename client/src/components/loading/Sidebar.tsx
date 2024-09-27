import { Skeleton } from "@/components/ui/skeleton";

export const SidebarSkeleton: React.FC<{ withSettings?: boolean; count: number; className: string }> = ({
  withSettings,
  count = 3,
  className = "border-r",
}) => {
  const items = Array.from({ length: count }, (_, i) => <Skeleton key={i} className="mb-2 h-10 w-full" />);
  return (
    <div
      className={"group relative flex w-[56px] flex-col overflow-hidden bg-background" + className}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-1 flex-col space-y-4 p-2">
        <div className="grow">{items}</div>
        {withSettings && (
          <div className="mt-auto border-t pt-3">
            <Skeleton className="h-10 w-full" />
          </div>
        )}
      </div>
    </div>
  );
};
