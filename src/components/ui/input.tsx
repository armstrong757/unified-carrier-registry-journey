
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-[#F1F1F1] file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&::file-selector-button]:mr-2 [&::-webkit-file-upload-button]:mr-2 [&::file-selector-button]:px-3 [&::file-selector-button]:py-1 [&::-webkit-file-upload-button]:px-3 [&::-webkit-file-upload-button]:py-1 [&::file-selector-button]:rounded [&::-webkit-file-upload-button]:rounded [&::file-selector-button]:hover:bg-[#E5E5E5] [&::-webkit-file-upload-button]:hover:bg-[#E5E5E5]",
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
