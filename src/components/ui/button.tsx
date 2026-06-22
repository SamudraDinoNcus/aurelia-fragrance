import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Varian "brand" & "outline-gold" ditambahkan khusus di luar preset shadcn
 * default, supaya tombol CTA bisa langsung meniru gaya pada mockup
 * (contoh: tombol "Shop now" putih solid di atas hero gelap, atau tombol
 * outline emas pada dashboard admin).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-label-md text-label-md uppercase tracking-widest transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground",
        brand: "bg-surface-container-lowest text-on-background hover:bg-on-surface hover:text-surface-container-lowest",
        outline: "border border-primary text-on-background hover:bg-primary hover:text-primary-foreground",
        "outline-gold": "border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-primary",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "border-b border-primary pb-1 hover:text-accent-gold hover:border-accent-gold",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        default: "px-8 py-3",
        sm: "px-5 py-2 text-[12px]",
        lg: "px-10 py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
