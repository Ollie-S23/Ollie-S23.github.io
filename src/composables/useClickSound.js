import { muted } from './useMute'

let context

/**
 * Play a short click, generated with the Web Audio API so no sound file is needed.
 *
 * @param {number} [pitch] Starting frequency in Hz.
 */
export function playClick(pitch = 660) {
  if (muted.value) return
  try {
    context ??= new AudioContext()
    context.resume()
    const now = context.currentTime
    const tone = context.createOscillator()
    const volume = context.createGain()
    tone.type = 'square' // retro, to match the pixel theme
    tone.frequency.setValueAtTime(pitch, now)
    volume.gain.setValueAtTime(0.05, now)
    volume.gain.exponentialRampToValueAtTime(0.001, now + 0.07)
    tone.connect(volume).connect(context.destination)
    tone.start(now)
    tone.stop(now + 0.07)
  } catch {
    // audio unavailable: the controls still work silently
  }
}
