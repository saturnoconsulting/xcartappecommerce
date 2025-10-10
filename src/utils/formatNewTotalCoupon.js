const formatNewTotalCoupon = (value) => {
    if (value === undefined || value === null || value === "") return "";
  
    // Assicura che sia un numero valido
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return "";
  
    // Forza due decimali
    const fixed = parsed.toFixed(2);
  
    const [euro, cents] = fixed.split(".");
  
    return `€ ${euro},${cents}`;
  };
  
  export default formatNewTotalCoupon;
  