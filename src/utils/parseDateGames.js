export const parseDateGames = (localdatetime) => {
  const [datePart, timePart] = localdatetime.split(' ');
  const [day, month, year] = datePart.split('/');

  // Mesi italiani abbreviati
  const months = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];
  const monthIndex = parseInt(month, 10) - 1;

  return {
    day,
    month: months[monthIndex],
    time: timePart
  };
};