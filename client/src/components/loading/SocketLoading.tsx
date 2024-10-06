import { LoadingSpinner } from "./LoadingSpinner";

const SocketLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="flex flex-col items-center space-y-4 text-center">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="text-lg text-muted-foreground">Connecting to the board...</p>
      </div>
    </div>
  );
};

export default SocketLoading;
