let audioCtx: AudioContext | null = null

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }
  return audioCtx
}

const playTone = (
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
) => {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, startTime)
  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

export const playSuccessSound = () => {
  const ctx = getAudioContext()
  const now = ctx.currentTime
  playTone(ctx, 523.25, now, 0.15) // C5
  playTone(ctx, 659.25, now + 0.12, 0.15) // E5
  playTone(ctx, 783.99, now + 0.24, 0.3) // G5
}

export const playErrorSound = () => {
  const ctx = getAudioContext()
  const now = ctx.currentTime
  playTone(ctx, 220, now, 0.2, 'sawtooth') // A3
  playTone(ctx, 196, now + 0.15, 0.3, 'sawtooth') // G3
}
