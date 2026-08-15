/**
 * Resizes an image file using an HTML canvas.
 * @param {File} file - The original image file
 * @param {number} maxWidth - Maximum width allowed
 * @param {number} maxHeight - Maximum height allowed
 * @param {number} quality - JPEG compression quality (0.0 to 1.0)
 * @returns {Promise<File>} A promise that resolves to the resized File object, or the original if unsupported.
 */
export const resizeImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    // If it's not a standard web image (like HEIC), canvas might fail, so just return the original file
    if (!file.type.match(/image\/(jpeg|png|webp|gif)/)) {
      console.warn("Unsupported image format for compression, uploading original file.");
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width || 1;
          canvas.height = height || 1;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.warn("Canvas context is null, returning original file");
            return resolve(file);
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.error("Canvas is empty, returning original file");
                return resolve(file);
              }
              const fileName = file.name ? file.name.replace(/\.[^/.]+$/, "") + ".jpeg" : "image.jpeg";
              const resizedFile = new File([blob], fileName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            },
            'image/jpeg',
            quality
          );
        } catch (error) {
          console.error("Error during image compression, returning original file:", error);
          resolve(file);
        }
      };
      img.onerror = () => {
        console.error("Image loading failed in canvas, returning original file");
        resolve(file);
      };
      img.src = readerEvent.target.result;
    };
    reader.onerror = () => {
       console.error("FileReader failed, returning original file");
       resolve(file);
    };
    reader.readAsDataURL(file);
  });
};
