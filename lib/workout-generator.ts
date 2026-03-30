import { WorkoutBlock } from './types'

export type TrainingType = 'motions' | 'teknisk' | 'kamp' | 'ungdom'
export type Duration = 60 | 90 | 120

function scale(base: number, from: Duration, to: Duration): number {
  return Math.round((base / from) * to)
}

export function generateWorkout(type: TrainingType, duration: Duration): WorkoutBlock[] {
  switch (type) {
    case 'motions':
      return [
        { order: 1, name: 'Opvarmning',             description: 'Løb, spring, skyggeboks',          durationMin: scale(10, 90, duration) },
        { order: 2, name: 'Udstrækning & mobilitet', description: '',                                  durationMin: scale(10, 90, duration) },
        { order: 3, name: 'Kombinationssekvenser',   description: 'Høj puls på pads/sandsæk',         durationMin: scale(15, 90, duration) },
        { order: 4, name: 'Teknik på sandsæk',       description: 'Middel intensitet',                durationMin: scale(15, 90, duration) },
        { order: 5, name: 'Styrkeblok',              description: 'Planke, burpees, squat',           durationMin: scale(10, 90, duration) },
        { order: 6, name: 'Sprint afslutning',       description: 'Intervalrunder',                   durationMin: scale(5,  90, duration) },
        ...(duration === 120 ? [{ order: 7, name: 'Cool-down & stræk', description: '', durationMin: 15 }] : []),
      ]
    case 'teknisk':
      return [
        { order: 1, name: 'Opvarmning',       description: 'Skyggeboks',                 durationMin: scale(10, 90, duration) },
        { order: 2, name: 'Udstrækning',      description: '',                           durationMin: scale(10, 90, duration) },
        { order: 3, name: 'Par-øvelse',       description: 'Timing og afstand',         durationMin: scale(15, 90, duration) },
        { order: 4, name: 'Individuel teknik',description: 'Dagens fokus med træner',    durationMin: scale(15, 90, duration) },
        { order: 5, name: 'Sandsæk',          description: 'Kombinationer',              durationMin: scale(10, 90, duration) },
        ...(duration === 120 ? [{ order: 6, name: 'Sparring', description: 'Teknisk kontrol', durationMin: 20 }] : []),
      ]
    case 'kamp':
      return [
        { order: 1, name: 'Opvarmning',          description: 'Reb & skyggeboks',      durationMin: scale(10, 90, duration) },
        { order: 2, name: 'Handske-pad arbejde', description: 'Med træner',            durationMin: scale(20, 90, duration) },
        { order: 3, name: 'Sparring',            description: 'Teknisk kontrol',       durationMin: scale(15, 90, duration) },
        { order: 4, name: 'Konditionsblok',      description: 'Intervalrunder',        durationMin: scale(10, 90, duration) },
        { order: 5, name: 'Cool-down & analyse', description: 'Feedback fra træner',   durationMin: scale(5,  90, duration) },
      ]
    case 'ungdom':
      return [
        { order: 1, name: 'Lege-opvarmning',   description: 'Bevægelses- og reaktionslege',      durationMin: scale(10, 60, duration) },
        { order: 2, name: 'Koordination',      description: 'Balance og koordinationsøvelser',   durationMin: scale(10, 60, duration) },
        { order: 3, name: 'Grundteknik',       description: 'Jab & kryds med korrekt fodstilling',durationMin: scale(15, 60, duration) },
        { order: 4, name: 'Sandsæk i par',     description: '',                                   durationMin: scale(10, 60, duration) },
        { order: 5, name: 'Konkurrence-runde', description: 'Sjov afsluttende aktivitet',         durationMin: scale(5,  60, duration) },
      ]
  }
}
