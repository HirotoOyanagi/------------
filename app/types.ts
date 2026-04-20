export interface VideoConfig {
  prompt: string
  aspectRatio: string
  duration: string | number
  resolution: '480p' | '720p'
  generateAudio: boolean
}
