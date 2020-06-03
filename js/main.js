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

// Notes (note taking not musical notes)
// create oscillator from BaseAudioContext class, guess it's inherited 
// createOscillator creates an OscillatorNode 
// so the start method, etc are from there 
// -- I copied marcgg's note chart onto a json file 
// http://www.techlib.com/reference/musical_note_frequencies.htm#:~:text=Starting%20at%20any%20note%20the,be%20positive%2C%20negative%20or%20zero.
// there is also a formula for notes, freq = note x 2^(N/12) where note is base note and N is number of notes away 

// lets say middle C is on the 4th octave: 261.6 
// octaves are 13 notes (half steps) apart so theres 12 before it repeats 
// 5-C (octave 5, C) should be C_oct5 = C_oct4 * 2**(12/12) or 2*C_oct4 
// 0-C is 16.35 

function roundTo(num, dec) {
  if (!dec) dec = -2
  return Math.round(num*10**-dec)/10**-dec 
}

// let's iterate and make our hash table of notes 
// half steps go to sharp except at E-F and B-C
const Cbase = 16.35
const notes = {}
const notesOctave = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

// for each octave make a new object in notes 
for (let i = 0; i <= 7; i++) {
  // each octave divisible by 12 so the exponent lines up to each int 
  const Coct = Cbase * 2**i 
  notes[i.toString()] = {}

  notesOctave.forEach((n,ind) => {
    // for each note n, make a key value pair with the note name and freq 
    // index can be used to do the calculation, base octave + N steps 
    // freqN = freq0 * 2(N/12), sanity check, 2(0/12) = 1 
    notes[i.toString()][n] = roundTo(Coct*2**(ind/12))
  })
}

console.log(notes)

// Initialize variables for AudioContext 
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
  }, 80)
})

// function to play a short sound, with processing for duration, note (Oct-Not), wave type 
function playNote(noteCode, ms, wType) {
  // initialize variables 
  const finalMs = 40

  // 2 optional arguments 
  if (!ms) ms = 1000 
  if (!wType) wType = 'sine'

  // create gain and oscillator 
  const w = context.createOscillator()
  const g = context.createGain()

  // connect them in series 
  w.connect(g)
  g.connect(context.destination)

  // set up wave 
  w.type = wType 

  // start the note 
  w.start()

  // we start stopping the wave after ms milliseconds
  // then we finally stop the wave with .stop 2*finalMs ms after that 
  setTimeout(() => {
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + (finalMs/1000))
    setTimeout(() => {
      w.stop()
    }, 2*finalMs)
  }, ms)

}


// iteratively create 0-7 octaves and all 12 notes 

