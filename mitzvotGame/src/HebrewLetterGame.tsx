import { useCallback, useEffect, useRef, useState } from 'react'
import { hebrewLetters, normalizeAnswer, type HebrewLetter } from './hebrewLetters'
import { playErrorSound, playSuccessSound } from './sounds'
import './HebrewLetterGame.css'

type Status = 'idle' | 'listening' | 'correct' | 'incorrect' | 'error'

const getSpeechRecognitionCtor = () =>
  window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null

const pickRandomLetter = (excludeChar?: string): HebrewLetter => {
  if (hebrewLetters.length === 1) return hebrewLetters[0]
  let next: HebrewLetter
  do {
    next = hebrewLetters[Math.floor(Math.random() * hebrewLetters.length)]
  } while (next.char === excludeChar)
  return next
}

const isCorrectAnswer = (transcript: string, letter: HebrewLetter) => {
  const normalized = normalizeAnswer(transcript)
  if (!normalized) return false
  return [...letter.acceptedHebrew, ...letter.acceptedLatin].some(
    (accepted) => normalized.includes(accepted) || accepted.includes(normalized),
  )
}

function HebrewLetterGame() {
  const [current, setCurrent] = useState<HebrewLetter>(() => pickRandomLetter())
  const [status, setStatus] = useState<Status>('idle')
  const [transcript, setTranscript] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [manualAnswer, setManualAnswer] = useState('')
  const [recognitionLang, setRecognitionLang] = useState<'he-IL' | 'es-ES'>('he-IL')

  const advanceTimeoutRef = useRef<number | null>(null)
  const isSupported = getSpeechRecognitionCtor() !== null

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current)
    }
  }, [])

  const goToNextLetter = useCallback(() => {
    setCurrent((prev) => pickRandomLetter(prev.char))
    setStatus('idle')
    setTranscript('')
    setManualAnswer('')
  }, [])

  const handleResult = useCallback(
    (heard: string) => {
      setTranscript(heard)
      if (isCorrectAnswer(heard, current)) {
        setStatus('correct')
        setScore((s) => s + 1)
        setStreak((s) => s + 1)
        playSuccessSound()
        advanceTimeoutRef.current = window.setTimeout(goToNextLetter, 1200)
      } else {
        setStatus('incorrect')
        setStreak(0)
        playErrorSound()
      }
    },
    [current, goToNextLetter],
  )

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return

    const recognition = new Ctor()
    recognition.lang = recognitionLang
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 3

    recognition.onresult = (event) => {
      const alternatives = event.results[0]
      let heard = ''
      for (let i = 0; i < alternatives.length; i += 1) {
        heard = alternatives[i].transcript
        if (isCorrectAnswer(heard, current)) break
      }
      handleResult(heard)
    }

    recognition.onerror = (event) => {
      setErrorMessage(event.error)
      setStatus('error')
    }

    recognition.onend = () => {
      setStatus((prev) => (prev === 'listening' ? 'idle' : prev))
    }

    setErrorMessage('')
    setStatus('listening')
    recognition.start()
  }, [current, handleResult, recognitionLang])

  const submitManualAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualAnswer.trim()) return
    handleResult(manualAnswer)
  }

  return (
    <div className="hebrew-game">
      <header className="hebrew-game__header">
        <h1>Aprende el alefato hebreo</h1>
        <p>Di en voz alta el nombre de la letra que ves en la tarjeta.</p>
      </header>

      <div className="hebrew-game__stats">
        <span>
          Aciertos: <strong>{score}</strong>
        </span>
        <span>
          Racha: <strong>{streak}</strong>
        </span>
      </div>

      <div
        className={`hebrew-game__card hebrew-game__card--${status}`}
        aria-live="polite"
      >
        <span className="hebrew-game__letter">{current.char}</span>
      </div>

      {status === 'correct' && (
        <p className="hebrew-game__feedback hebrew-game__feedback--correct">
          ¡Correcto! Es {current.transliteration} ({current.name}) 🎉
        </p>
      )}
      {status === 'incorrect' && (
        <p className="hebrew-game__feedback hebrew-game__feedback--incorrect">
          No es correcto{transcript ? ` (escuché: "${transcript}")` : ''}. Inténtalo de nuevo.
        </p>
      )}
      {status === 'error' && (
        <p className="hebrew-game__feedback hebrew-game__feedback--incorrect">
          Error de reconocimiento de voz: {errorMessage || 'inténtalo de nuevo'}.
        </p>
      )}

      {isSupported ? (
        <div className="hebrew-game__controls">
          <label className="hebrew-game__lang">
            Idioma para hablar:
            <select
              value={recognitionLang}
              onChange={(e) => setRecognitionLang(e.target.value as 'he-IL' | 'es-ES')}
            >
              <option value="he-IL">Hebreo (recomendado)</option>
              <option value="es-ES">Español (transliteración)</option>
            </select>
          </label>
          <button
            type="button"
            className="hebrew-game__mic"
            onClick={startListening}
            disabled={status === 'listening'}
          >
            {status === 'listening' ? '🎙️ Escuchando…' : '🎤 Hablar'}
          </button>
        </div>
      ) : (
        <div className="hebrew-game__fallback">
          <p>
            Tu navegador no soporta reconocimiento de voz. Prueba en Chrome o Edge, o escribe
            tu respuesta abajo.
          </p>
          <form onSubmit={submitManualAnswer} className="hebrew-game__manual-form">
            <input
              type="text"
              value={manualAnswer}
              onChange={(e) => setManualAnswer(e.target.value)}
              placeholder="Escribe el nombre de la letra"
              aria-label="Nombre de la letra"
            />
            <button type="submit">Comprobar</button>
          </form>
        </div>
      )}

      {status === 'incorrect' && (
        <button type="button" className="hebrew-game__skip" onClick={goToNextLetter}>
          Saltar a otra letra
        </button>
      )}
    </div>
  )
}

export default HebrewLetterGame
