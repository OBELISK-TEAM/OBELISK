export interface ErrorComponentProps {
  error: Error & { digest?: string };
  reset: () => void;
}
