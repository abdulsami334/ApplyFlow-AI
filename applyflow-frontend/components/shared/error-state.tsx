import { Alert } from "@/components/ui/alert";

export function ErrorState({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="shadow-sm">
      {message}
    </Alert>
  );
}
