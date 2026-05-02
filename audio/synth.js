export class SynthVoice {
  constructor(context, output) {
    this.context = context;
    this.output = output;
  }

  createNoiseBuffer(lengthSeconds = 0.12) {
    const buffer = this.context.createBuffer(
      1,
      Math.floor(this.context.sampleRate * lengthSeconds),
      this.context.sampleRate
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  trigger({
    frequency = 220,
    type = "sine",
    duration = 0.22,
    attack = 0.01,
    release = 0.18,
    gain = 0.18,
    detune = 0
  }) {
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.detune.setValueAtTime(detune, now);

    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.linearRampToValueAtTime(gain, now + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

    oscillator.connect(envelope);
    envelope.connect(this.output);

    oscillator.start(now);
    oscillator.stop(now + duration + release + 0.02);
  }

  kick() {
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(140, now);
    oscillator.frequency.exponentialRampToValueAtTime(42, now + 0.18);

    envelope.gain.setValueAtTime(0.001, now);
    envelope.gain.exponentialRampToValueAtTime(0.75, now + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    oscillator.connect(envelope);
    envelope.connect(this.output);

    oscillator.start(now);
    oscillator.stop(now + 0.24);
  }

  hat() {
    const now = this.context.currentTime;
    const buffer = this.createNoiseBuffer(0.08);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] *= 1 - i / data.length;
    }

    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();

    source.buffer = buffer;
    filter.type = "highpass";
    filter.frequency.value = 6500;
    envelope.gain.value = 0.16;

    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.output);

    source.start(now);
    source.stop(now + 0.08);
  }

  snare() {
    const now = this.context.currentTime;
    const noise = this.context.createBufferSource();
    const noiseFilter = this.context.createBiquadFilter();
    const noiseEnvelope = this.context.createGain();
    const tone = this.context.createOscillator();
    const toneEnvelope = this.context.createGain();

    noise.buffer = this.createNoiseBuffer(0.18);
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 1800;
    noiseEnvelope.gain.setValueAtTime(0.001, now);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.22, now + 0.004);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    tone.type = "triangle";
    tone.frequency.setValueAtTime(220, now);
    tone.frequency.exponentialRampToValueAtTime(120, now + 0.12);
    toneEnvelope.gain.setValueAtTime(0.001, now);
    toneEnvelope.gain.exponentialRampToValueAtTime(0.18, now + 0.003);
    toneEnvelope.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(this.output);
    tone.connect(toneEnvelope);
    toneEnvelope.connect(this.output);

    noise.start(now);
    tone.start(now);
    noise.stop(now + 0.18);
    tone.stop(now + 0.14);
  }

  clap() {
    const now = this.context.currentTime;
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();

    source.buffer = this.createNoiseBuffer(0.22);
    filter.type = "bandpass";
    filter.frequency.value = 1400;

    envelope.gain.setValueAtTime(0.001, now);
    envelope.gain.exponentialRampToValueAtTime(0.18, now + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    envelope.gain.setValueAtTime(0.001, now + 0.05);
    envelope.gain.exponentialRampToValueAtTime(0.16, now + 0.058);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    envelope.gain.setValueAtTime(0.001, now + 0.11);
    envelope.gain.exponentialRampToValueAtTime(0.12, now + 0.118);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.output);

    source.start(now);
    source.stop(now + 0.22);
  }

  pluck({
    frequency = 220,
    type = "triangle",
    gain = 0.12,
    tone = 2800
  }) {
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(tone, now);

    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.linearRampToValueAtTime(gain, now + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

    oscillator.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.output);

    oscillator.start(now);
    oscillator.stop(now + 0.28);
  }

  pad({
    frequency = 220,
    chord = [0, 7, 12],
    gain = 0.08,
    type = "sawtooth",
    width = 0.8
  }) {
    const now = this.context.currentTime;
    const mix = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    mix.gain.setValueAtTime(0.0001, now);
    mix.gain.linearRampToValueAtTime(gain, now + 0.22);
    mix.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    filter.type = "lowpass";
    filter.frequency.value = 2200 + width * 1600;

    for (const semitone of chord) {
      const oscillator = this.context.createOscillator();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency * (2 ** (semitone / 12)), now);
      oscillator.detune.setValueAtTime((Math.random() - 0.5) * 14, now);
      oscillator.connect(filter);
      oscillator.start(now);
      oscillator.stop(now + 1.7);
    }

    filter.connect(mix);
    mix.connect(this.output);
  }
}
