import { describe, test, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
    test('merges class names', () => {
        expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
    })

    test('handles conditional classes', () => {
        const isActive = true
        const result = cn('base', isActive && 'active')
        expect(result).toContain('base')
        expect(result).toContain('active')
    })

    test('handles falsy values', () => {
        const result = cn('base', false, null, undefined, 'end')
        expect(result).toBe('base end')
    })

    test('merges tailwind classes correctly', () => {
        // twMerge should resolve conflicting tailwind classes
        const result = cn('px-4', 'px-6')
        expect(result).toBe('px-6')
    })

    test('handles empty input', () => {
        expect(cn()).toBe('')
    })
})
