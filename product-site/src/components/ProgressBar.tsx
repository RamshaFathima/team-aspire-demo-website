import { Progress } from "@/components/ui/progress";

export default function ProgressBar({ value }: { value: number }) {
  return <Progress value={value} />;
}
