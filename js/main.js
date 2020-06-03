// Source attribution: 
// marcgg blog, accessed 6 / 3 / 2020
// https://marcgg.com/blog/2016/11/01/javascript-audio/ 
// class doc
// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/AudioContext 
// let context = new AudioContext()
// let wave = context.createOscillator()
// wave.type = "sine" // or square, triangle, sawtooth (custom possible too)
// wave.connect(context.destination) 
// wave.start 

// Notes
// create oscillator from BaseAudioContext class, guess it's inherited 
// createOscillator creates an OscillatorNode 
// so the start method, etc are from there 

// Initialize variables
const context = new AudioContext()
let wave
let atten 
let playing = false 

const playSound = document.querySelector('#playButton')
const stopSound = document.querySelector('#stopButton')

playSound.addEventListener('click', () => {
  if (!playing) {
    wave = context.createOscillator()
    wave.type = "sine" // or square, triangle, sawtooth
    atten = context.createGain()
    // instead of connecting both, wave -> atten -> context 
    wave.connect(atten)
    atten.connect(context.destination)

    wave.start()
    playing = true 
  }
})

stopSound.addEventListener('click', () => {
  atten.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.04)
  setTimeout(() => {
    wave.stop()
    playing = false
  }, 40)
})
