import type { LucideIcon } from 'lucide-react'
import { Icon } from '@/components/ui/icon'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendColor?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendColor = 'text-green-600',
  className,
}: StatCardProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <Icon icon={icon} className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-card-foreground">{value}</div>
        {trend && (
          <p className={cn('text-xs mt-2', trendColor)}>{trend}</p>
        )}
      </div>
    </Card>
  )
}
