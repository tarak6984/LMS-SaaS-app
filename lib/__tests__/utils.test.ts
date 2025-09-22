import { getSubjectColor, configureAssistant } from '../utils'

describe('Utils', () => {
  describe('getSubjectColor', () => {
    it('returns correct color for existing subjects', () => {
      expect(getSubjectColor('maths')).toBe('#FFDA6E')
      expect(getSubjectColor('science')).toBe('#E5D0FF')
      expect(getSubjectColor('coding')).toBe('#FFC8E4')
    })

    it('returns undefined for non-existing subjects', () => {
      expect(getSubjectColor('nonexistent')).toBeUndefined()
    })
  })

  describe('configureAssistant', () => {
    it('creates correct Vapi assistant configuration', () => {
      const config = configureAssistant('female', 'casual')
      
      expect(config).toEqual({
        name: 'Companion',
        firstMessage: "Hello, let's start the session. Today we'll be talking about {{topic}}.",
        transcriber: {
          provider: 'deepgram',
          model: 'nova-3',
          language: 'en'
        },
        voice: {
          provider: '11labs',
          voiceId: 'ZIlrSGI4jZqobxRKprJz', // female casual voice
          stability: 0.4,
          similarityBoost: 0.8,
          speed: 1,
          style: 0.5,
          useSpeakerBoost: true
        },
        model: {
          provider: 'openai',
          model: 'gpt-4',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('You are a highly knowledgeable tutor')
            })
          ])
        },
        clientMessages: [],
        serverMessages: []
      })
    })

    it('uses fallback voice ID for unknown combinations', () => {
      const config = configureAssistant('unknown', 'unknown')
      
      expect(config.voice.voiceId).toBe('sarah')
    })

    it('configures different voice IDs for different combinations', () => {
      const maleFormal = configureAssistant('male', 'formal')
      const maleCasual = configureAssistant('male', 'casual')
      
      expect(maleFormal.voice.voiceId).toBe('c6SfcYrb2t09NHXiT80T')
      expect(maleCasual.voice.voiceId).toBe('2BJW5coyhAzSr8STdHbE')
    })
  })
})