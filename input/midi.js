export async function attachMidi(runtime) {
  if (!navigator.requestMIDIAccess) {
    return;
  }

  try {
    const access = await navigator.requestMIDIAccess();
    for (const input of access.inputs.values()) {
      input.onmidimessage = (message) => {
        runtime.emit("midi", {
          data: Array.from(message.data)
        });
      };
    }
  } catch (error) {
    console.warn("MIDI unavailable", error);
  }
}

