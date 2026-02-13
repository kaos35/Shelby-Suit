import type { LucideIcon } from 'lucide-react'

export type { LucideIcon }

export interface IconProps {
  icon: LucideIcon
  className?: string
}

export function Icon({ icon: IconComponent, className }: IconProps) {
  return <IconComponent className={className} />
}
