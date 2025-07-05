document.getElementById('checkBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const numbers = document.getElementById('numbersInput').value;

  if (!fileInput.files[0] || !numbers.trim()) {
    alert('Bitte Bild und Zahlen eingeben.');
    return;
  }

  const formData = new FormData();
  formData.append('image', fileInput.files[0]);
  formData.append('numbers', numbers);

  try {
    const response = await fetch('https://lotto-checker-server.onrender.com/check_lotto', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Fehler vom Server: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    const boundaryMatch = contentType.match(/boundary="?(.+?)"?$/);
    const boundary = boundaryMatch ? boundaryMatch[1] : null;

    const buffer = await response.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    const parts = text.split(`--${boundary}`);
    const imagePart = parts.find(part => part.includes('Content-Type: image/jpeg'));
    if (!imagePart) throw new Error('Kein Bild gefunden.');

    const base64Start = imagePart.indexOf('\r\n\r\n') + 4;
    const base64Content = imagePart.slice(base64Start).trim();

    // Blob aus Base64 erzeugen
    const byteCharacters = atob(base64Content);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const imgUrl = URL.createObjectURL(blob);

    document.getElementById('resultImage').src = imgUrl;

  } catch (error) {
    console.error(error);
    alert('Fehler bei der Antwort vom Server oder beim Bild-Rendern.');
  }
});
