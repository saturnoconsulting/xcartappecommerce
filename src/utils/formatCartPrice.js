export const formatCartPrice = (price) => {
    if (price == null) return null;
    return `€ ${(price / 100).toFixed(2).replace('.', ',')}`;
};