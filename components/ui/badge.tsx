import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 transition-[color,box-shadow,border] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-primary/25 bg-primary/12 text-primary [a&]:hover:bg-primary/18',
        secondary:
          'border-secondary/60 bg-secondary text-secondary-foreground',
        destructive:
          'border-destructive/30 bg-destructive/10 text-destructive [a&]:hover:bg-destructive/20 focus-visible:ring-destructive/30',
        outline:
          'border-border/80 text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        success:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        warning:
          'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
        ghost:
          'border-transparent text-muted-foreground bg-transparent hover:bg-muted/60',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
