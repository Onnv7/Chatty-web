export async function getMediaStream() {
  return await navigator.mediaDevices.getUserMedia({
    video: {
      aspectRatio: 16 / 9,
      width: { ideal: 1280 }, // Adjust the width as needed
      height: { ideal: 720 }, // Adjust the height as needed
    },
    audio: true,
  });
}
