const formatDate = (date) => {
  if (!date) return "";

  const parts = date.toString().substr(0, 10).split("-");
  if (parts.length !== 3) return "";

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

export default formatDate;
