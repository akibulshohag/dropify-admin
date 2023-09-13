const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = image.width;
        let height = image.height;

        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = Math.max(width, height);
        if (maxDimension > 800) {
          const scaleRatio = 800 / maxDimension;
          width *= scaleRatio;
          height *= scaleRatio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image onto canvas with the new dimensions
        ctx.drawImage(image, 0, 0, width, height);

        // Convert canvas content to base64
        canvas.toBlob(
          (blob) => {
            // Compress the image blob
            const compressedBlobPromise = new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result);
              };
              reader.readAsDataURL(blob);
            });
            compressedBlobPromise.then((compressedBase64) => {
              resolve(compressedBase64);
            });
          },
          "image/jpeg", // Change format if needed (e.g., 'image/png')
          0.7 // Adjust the compression quality as desired (0.0 - 1.0)
        );
      };
      // Handle image loading error
      image.onerror = () => {
        reject(new Error("Failed to load the image."));
      };
      // Load the image
      image.src = event.target.result;
    };
    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
};

module.exports = {
  convertImageToBase64,
};
