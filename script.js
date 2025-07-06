document.getElementById('checkForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const imageInput = document.getElementById('image');
  const numbersInput = document.getElementById('numbers');
  const resultImg = document.getElementById('resultImage');

  if (!imageInput.files.length || !numbersInput.value.trim()) {
    alert("Bitte Bild und Zahlen eingeben.");
    return;
  }

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('numbers', numbersInput.value);

  try {
    const response = await fetch('https://lotto-checker-server.onrender.com/check_lotto', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Serverfehler');

    const contentType = response.headers.get('content-type');
    if (!contentType.includes('multipart/mixed')) throw new Error('Unerwarteter Antworttyp');

    const boundary = contentType.split('boundary=')[1];
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder("utf-8");
    const body = decoder.decode(buffer);

    const parts = body.split(`--${boundary}`);
    for (let part of parts) {
      if (part.includes('Content-Type: image/jpeg')) {
        const base64 = btoa(
          new Uint8Array(buffer.slice(
            body.indexOf('\r\n\r\n') + 4
          )).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        resultImg.src = `data:image/jpeg;base64,${base64}`;
        return;
      }
    }

    throw new Error('Bild nicht gefunden');

  } catch (err) {
    console.error(err);
    resultImg.alt = "Fehler beim Laden des Ergebnisses.";
  }
});
