import { render, screen } from '@testing-library/react'
import CompanionCard from '../CompanionCard'

const mockCompanion = {
  id: 'test-id',
  name: 'Test Companion',
  subject: 'maths',
  topic: 'Algebra',
  duration: 30,
  color: '#FFDA6E'
}

describe('CompanionCard', () => {
  it('renders companion information correctly', () => {
    render(<CompanionCard {...mockCompanion} />)
    
    expect(screen.getByText('Test Companion')).toBeInTheDocument()
    expect(screen.getByText('Algebra')).toBeInTheDocument()
    expect(screen.getByText('30 minutes')).toBeInTheDocument()
  })

  it('displays the correct subject badge', () => {
    render(<CompanionCard {...mockCompanion} />)
    
    expect(screen.getByText('maths')).toBeInTheDocument()
  })

  it('has correct link to companion page', () => {
    render(<CompanionCard {...mockCompanion} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/companions/test-id')
  })

  it('applies the correct subject color', () => {
    render(<CompanionCard {...mockCompanion} />)
    
    const subjectIcon = screen.getByAltText('maths')
    const iconContainer = subjectIcon.closest('div')
    expect(iconContainer).toHaveStyle({ backgroundColor: '#FFDA6E' })
  })
})