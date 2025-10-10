const formatPrice = (priceNumber) => {
  if (typeof priceNumber === "undefined" || priceNumber === null) {
    return "";
  }
  const price = priceNumber.toString();
  const splitPrice = price.split(".");

  const cents = splitPrice[1] ? splitPrice[1].padEnd(2, "0") : "00";

  return `€ ${splitPrice[0]},${cents}`;
};

export default formatPrice;
