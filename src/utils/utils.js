export const extractTaglia = (description) => {
    if (!description) return '';
    
    // Cerca l'ultima parte dopo il trattino
    const parts = description.split("-");
    const lastPart = parts[parts.length - 1]?.trim();
  
    // Controlla che sia un numero (opzionalmente anche taglie tipo "46/48")
    if (/^\d+([/]\d+)?$/.test(lastPart)) {
      return lastPart;
    }
  
    return lastPart || description;
  };
  