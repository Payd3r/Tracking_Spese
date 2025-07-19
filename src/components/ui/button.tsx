import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "liquid-button bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-2xl",
        destructive:
          "liquid-button bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-2xl",
        outline:
          "liquid-button border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-2xl",
        secondary:
          "liquid-button bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-2xl",
        ghost: "liquid-button hover:bg-accent hover:text-accent-foreground hover:shadow-2xl",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "liquid-button backdrop-blur-xl border border-white/25 shadow-xl hover:shadow-2xl",
        success: "liquid-button bg-success text-success-foreground hover:bg-success/90 hover:shadow-2xl",
        warning: "liquid-button bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-2xl",
        liquid: "liquid-button bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:shadow-2xl animate-bounce-subtle",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 py-2",
        lg: "h-14 rounded-xl px-10 py-4 text-base",
        icon: "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
