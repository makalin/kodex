export function createMasterChain(context) {
  const input = context.createGain();
  const delay = context.createDelay(1.2);
  const feedback = context.createGain();
  const wet = context.createGain();
  const dry = context.createGain();
  const filter = context.createBiquadFilter();
  const output = context.createGain();

  delay.delayTime.value = 0.18;
  feedback.gain.value = 0.28;
  wet.gain.value = 0.14;
  dry.gain.value = 0.9;
  filter.type = "lowpass";
  filter.frequency.value = 14000;
  output.gain.value = 0.9;

  input.connect(dry);
  input.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  dry.connect(filter);
  wet.connect(filter);
  filter.connect(output);
  output.connect(context.destination);

  return {
    input,
    delay,
    wet,
    feedback,
    filter,
    output,
    setDelay(value) {
      delay.delayTime.setTargetAtTime(Math.max(0, Math.min(0.8, value)), context.currentTime, 0.01);
    },
    setFeedback(value) {
      feedback.gain.setTargetAtTime(Math.max(0, Math.min(0.92, value)), context.currentTime, 0.01);
    },
    setFilter(value) {
      filter.frequency.setTargetAtTime(Math.max(120, Math.min(18000, value)), context.currentTime, 0.02);
    },
    setWet(value) {
      wet.gain.setTargetAtTime(Math.max(0, Math.min(1, value)), context.currentTime, 0.01);
    },
    setMaster(value) {
      output.gain.setTargetAtTime(Math.max(0, Math.min(1.2, value)), context.currentTime, 0.01);
    }
  };
}
