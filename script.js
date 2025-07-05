async function checkLotto() {
  const imageInput = document.getElementById('fileInput').files[0];
  const numbers = document.getElementById('numbersInput').value;

  if (!imageInput || !numbers) {
    alert("Bitte Bild und Zahlen angeben!");
    return;
  }

  const formData = new FormData();
  formData.append('image', imageInput);
  formData.append('numbers', numbers);

  try {
    const response = await fetch('https://lotto-checker-server.onrender.com/check_lotto', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Serverfehler');

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    document.getElementById('outputImage').src = imageUrl;

  } catch (err) {
    alert("Fehler bei der Serverantwort oder beim Laden des Bildes.");
    console.error(err);
  }
}
