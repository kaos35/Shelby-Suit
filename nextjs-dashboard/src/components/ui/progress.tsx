import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          'relative w-full h-2 overflow-hidden rounded-full bg-primary/20',
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = 'Progress'

interface ProgressValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const ProgressValue = React.forwardRef<HTMLDivElement, ProgressValueProps>(
  ({ className, value, max = 100, ...props }, ref) => {
    const percentage = value != null ? Math.round((value / max) * 100) : null

    return (
      <div
        ref={ref}
        className={cn('text-xs font-medium tabular-nums text-foreground', className)}
        {...props}
      >
        {percentage !== null ? `${percentage}%` : null}
      </div>
    )
  }
)
ProgressValue.displayName = 'ProgressValue'

export { Progress, ProgressValue }
