import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DishAssessmentCard } from '@/components/DishAssessmentCard'

describe('DishAssessmentCard', () => {
  it('toont herkende ingrediënten, dekking en een onbekend-ingrediënt met ober-vraag', () => {
    render(
      <DishAssessmentCard
        dish="Carpaccio"
        ingredients={['parmezaanse kaas', 'rucola', 'volstrekt onbekend xyzzy']}
        conditions={['migraine']}
      />,
    )
    // gematchte DB-itemnamen
    expect(screen.getByText('Parmezaan')).toBeInTheDocument()
    expect(screen.getByText('Rucola')).toBeInTheDocument()
    // dekking 2/3 ≈ 67%
    expect(screen.getByText('67%')).toBeInTheDocument()
    // onbekend ingrediënt → ober-vraag
    expect(screen.getByText(/niet bekend/i)).toBeInTheDocument()
    expect(screen.getByText(/Kan dit zonder/i)).toBeInTheDocument()
  })

  it('toont per triggerend ingrediënt de uitleg-met-bron', () => {
    render(
      <DishAssessmentCard dish="Carpaccio" ingredients={['parmezaanse kaas']} conditions={['migraine']} />,
    )
    // parmezaan is een migraine-trigger (gerijpte kaas) → chip + bronlink
    expect(screen.getByText(/Migraine ·/)).toBeInTheDocument()
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
  })

  it('profiel-scoping: niet-actieve aandoeningen verschijnen niet', () => {
    render(
      <DishAssessmentCard dish="Carpaccio" ingredients={['parmezaanse kaas']} conditions={['migraine']} />,
    )
    expect(screen.queryByText('Jicht')).not.toBeInTheDocument()
    expect(screen.queryByText('Nierstenen')).not.toBeInTheDocument()
  })

  it('onder de dekkingsdrempel: geen gerecht-totaal maar een waarschuwing', () => {
    render(
      <DishAssessmentCard
        dish="Onbekend gerecht"
        ingredients={['rucola', 'xyzzy1', 'xyzzy2']}
        conditions={['jicht']}
      />,
    )
    expect(screen.getByText('33%')).toBeInTheDocument()
    expect(screen.getByText(/Te weinig herkend/i)).toBeInTheDocument()
  })

  it('markeert een representatieve (benaderende) match expliciet', () => {
    render(
      <DishAssessmentCard dish="Kaasplankje" ingredients={['kaas']} conditions={['histamine']} />,
    )
    // toont de menukaart-term, niet het DB-item, + een "≈ beoordeeld als"-toelichting
    expect(screen.getByText('kaas')).toBeInTheDocument()
    expect(screen.getByText(/≈ beoordeeld als/i)).toBeInTheDocument()
    expect(screen.getByText(/representatief/i)).toBeInTheDocument()
  })
})
