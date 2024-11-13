import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const BoardError = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-error-foreground">Connection error</h1>
      <p className="text-error-foreground">We encountered an error while trying to connect to the board</p>
      <div className={"flex gap-4"}>
        <Button onClick={() => window.location.reload()} variant="secondary" className={"w-48"}>
          Refresh the page
        </Button>
        <Button className={"w-48"} onClick={() => router.push("/user-boards")}>
          Return to your boards
        </Button>
      </div>
    </div>
  );
};
