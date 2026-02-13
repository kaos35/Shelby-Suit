import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card', () => {
    test('renders card with children', () => {
        render(<Card>Card content</Card>)
        expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    test('renders card with custom className', () => {
        const { container } = render(<Card className="p-8">Content</Card>)
        const card = container.firstChild as HTMLElement
        expect(card.className).toContain('p-8')
        expect(card.className).toContain('rounded-lg')
    })
})

describe('CardHeader', () => {
    test('renders header with children', () => {
        render(<CardHeader>Header</CardHeader>)
        expect(screen.getByText('Header')).toBeInTheDocument()
    })
})

describe('CardTitle', () => {
    test('renders title as h3', () => {
        render(<CardTitle>My Title</CardTitle>)
        const title = screen.getByText('My Title')
        expect(title.tagName).toBe('H3')
    })
})

describe('CardDescription', () => {
    test('renders description as p', () => {
        render(<CardDescription>Description text</CardDescription>)
        const desc = screen.getByText('Description text')
        expect(desc.tagName).toBe('P')
    })
})

describe('CardContent', () => {
    test('renders content area', () => {
        render(<CardContent>Content area</CardContent>)
        expect(screen.getByText('Content area')).toBeInTheDocument()
    })
})

describe('CardFooter', () => {
    test('renders footer', () => {
        render(<CardFooter>Footer area</CardFooter>)
        expect(screen.getByText('Footer area')).toBeInTheDocument()
    })
})

describe('Full Card Composition', () => {
    test('renders complete card with all sub-components', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Test Card</CardTitle>
                    <CardDescription>A test card description</CardDescription>
                </CardHeader>
                <CardContent>Main content here</CardContent>
                <CardFooter>Footer buttons</CardFooter>
            </Card>
        )

        expect(screen.getByText('Test Card')).toBeInTheDocument()
        expect(screen.getByText('A test card description')).toBeInTheDocument()
        expect(screen.getByText('Main content here')).toBeInTheDocument()
        expect(screen.getByText('Footer buttons')).toBeInTheDocument()
    })
})
