import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
    test('renders with text content', () => {
        render(<Badge>Active</Badge>)
        expect(screen.getByText('Active')).toBeInTheDocument()
    })

    test('renders with default variant', () => {
        const { container } = render(<Badge>Default</Badge>)
        const badge = container.firstChild as HTMLElement
        expect(badge.className).toContain('bg-primary')
    })

    test('renders with destructive variant', () => {
        const { container } = render(<Badge variant="destructive">Error</Badge>)
        const badge = container.firstChild as HTMLElement
        expect(badge.className).toContain('bg-destructive')
    })

    test('renders with outline variant', () => {
        const { container } = render(<Badge variant="outline">Outline</Badge>)
        const badge = container.firstChild as HTMLElement
        expect(badge.className).toContain('text-foreground')
    })

    test('accepts custom className', () => {
        const { container } = render(<Badge className="custom-class">Custom</Badge>)
        const badge = container.firstChild as HTMLElement
        expect(badge.className).toContain('custom-class')
    })
})
