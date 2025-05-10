export function downloadQRCode(
  base64Data: string,
  fileName: string = "qrcode.png"
): void {
  const image = new Image();
  image.onload = () => {
    // Create canvas with higher resolution (at least 500x500)
    const canvas = document.createElement("canvas");
    const size = Math.max(image.width, image.height, 500);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Optional: fill canvas with white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // Scale the image to fit the canvas
      ctx.drawImage(image, 0, 0, size, size);

      const scaledData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = scaledData;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  image.src = base64Data;
}
