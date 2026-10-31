import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/**
 * Toggle: a 52 by 32 track with a 2 px input edge inside a 44 px tall hit area, so the control
 * meets the 44 px target while the track keeps its drawn size. On = primary.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "group peer relative inline-flex h-11 w-[3.25rem] shrink-0 cursor-pointer items-center rounded-full bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
      className
    )}
    {...props}
    ref={ref}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1.5 h-8 rounded-full border-2 border-input transition-colors group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary"
    />
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none absolute left-[6px] top-3 block h-5 w-5 rounded-full bg-input ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-primary-foreground"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
