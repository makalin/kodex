export class Sampler {
  constructor(context, voice) {
    this.context = context;
    this.voice = voice;
  }

  trigger(name) {
    if (name === "kick") {
      this.voice.kick();
      return;
    }

    if (name === "snare") {
      this.voice.snare();
      return;
    }

    if (name === "clap") {
      this.voice.clap();
      return;
    }

    if (name === "hat") {
      this.voice.hat();
      return;
    }

    this.voice.trigger({
      frequency: 180,
      type: "triangle",
      duration: 0.08,
      release: 0.06,
      gain: 0.08
    });
  }
}
