
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-slate-200 file:text-sm file:font-medium file:mr-4 file:py-2 file:px-4 [&::-webkit-file-upload-button]:bg-slate-200 [&::-webkit-file-upload-button]:border-0 [&::-webkit-file-upload-button]:text-sm [&::-webkit-file-upload-button]:font-medium [&::-webkit-file-upload-button]:mr-4 [&::-webkit-file-upload-button]:py-2 [&::-webkit-file-upload-button]:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
