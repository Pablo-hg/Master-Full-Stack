export const getDominantColor = (imgSrc, callback) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Permite cargar imágenes externas
    img.src = imgSrc;
  
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      // Ajusta el canvas al tamaño de la imagen
      canvas.width = img.width;
      canvas.height = img.height;
  
      // Dibuja la imagen en el canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);
  
      // Obtén los datos de los píxeles
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  
      let r = 0, g = 0, b = 0, total = 0;
  
      // Recorre los píxeles y calcula el promedio de color
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];     // Rojo
        g += imageData[i + 1]; // Verde
        b += imageData[i + 2]; // Azul
        total++;
      }
  
      // Calcula los valores promedio de RGB
      r = Math.floor(r / total);
      g = Math.floor(g / total);
      b = Math.floor(b / total);
  
      callback(`rgb(${r}, ${g}, ${b})`); // Devuelve el color promedio
    };
  
    img.onerror = () => {
      callback(null); // Maneja errores de carga de imágenes
    };
  };
  