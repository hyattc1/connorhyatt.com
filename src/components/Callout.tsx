import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type CalloutType = "info" | "warning" | "success";

interface CalloutProps {
  children: ReactNode;
  type?: CalloutType;
}

const typeStyles: Record<CalloutType, string> = {
  info: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/30",
  warning: "border-l-amber-500 bg-amber-50 dark:bg-amber-950/30",
  success: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
};

export default function Callout({ children, type = "info" }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 rounded-r-lg border-l-4 px-4 py-3 text-sm",
        typeStyles[type]
      )}
    >
      {children}
    </div>
  );
}

