import { describe, it, expect } from 'vitest'
import { locationSchema } from '../../validation/locationSchema'

describe('Location Schema', () => {
  it('accepts valid city names', () => {
    expect(locationSchema.parse('London')).toBe('London')
    expect(locationSchema.parse('New York')).toBe('New York')
    expect(locationSchema.parse('San Francisco, CA')).toBe(
      'San Francisco, CA',
    )
    expect(locationSchema.parse('St. Petersburg')).toBe('St. Petersburg')
    expect(locationSchema.parse('Stratford-upon-Avon')).toBe(
      'Stratford-upon-Avon',
    )
  })

  it('trims whitespace', () => {
    expect(locationSchema.parse('  London  ')).toBe('London')
  })

  it('rejects empty string', () => {
    expect(() => locationSchema.parse('')).toThrow()
  })

  it('rejects single character', () => {
    expect(() => locationSchema.parse('A')).toThrow()
  })

  it('rejects strings over 100 characters', () => {
    const long = 'a'.repeat(101)
    expect(() => locationSchema.parse(long)).toThrow()
  })

  it('rejects strings with numbers', () => {
    expect(() => locationSchema.parse('City123')).toThrow()
  })

  it('rejects strings with special characters', () => {
    expect(() => locationSchema.parse('City!')).toThrow()
    expect(() => locationSchema.parse('City@#$')).toThrow()
  })

  it('rejects whitespace-only input', () => {
    expect(() => locationSchema.parse('   ')).toThrow()
  })
})
