import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-page", className)} {...rest} />;
}
