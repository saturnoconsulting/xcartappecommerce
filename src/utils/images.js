import { placeholderImage } from "../constants/images";

export const getProductImage = (product) => {
  if (!product?.images) return placeholderImage;

  // Caso 1: è un array
  if (Array.isArray(product.images) && product.images.length > 0) {
    return { uri: product.images[0].imageUrl };
  }

  // Caso 2: è un oggetto (es: { "1": { imageUrl: "..." } })
  if (typeof product.images === 'object') {
    const firstKey = Object.keys(product.images)[0];
    const imageObj = product.images[firstKey];
    if (imageObj?.imageUrl) return { uri: imageObj.imageUrl };
  }

  // fallback
  return placeholderImage;
};



export const normalizeImages = (product) => {
  if (!product) return [];

  let allImages = [];
  // Caso 1: product.images (array o oggetto)
  if (product.images) {
    const imgs = Array.isArray(product.images)
      ? product.images
      : Object.values(product.images);
    allImages = [...allImages, ...imgs];
  }

  // Caso 2: product.compounds (prodotti composti)
  if (product.compounds && Array.isArray(product.compounds)) {
    product.compounds.forEach((compound) => {
      if (compound.images) {
        const compoundImgs = Array.isArray(compound.images)
          ? compound.images
          : Object.values(compound.images);
        allImages = [...allImages, ...compoundImgs];
      }
    });
  }

  // Elimina duplicati (per URL)
  const uniqueImages = allImages.filter(
    (img, index, self) =>
      img?.imageUrl &&
      index === self.findIndex((i) => i.imageUrl === img.imageUrl)
  );

  return uniqueImages;
};