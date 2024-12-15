export function convertDateToAPIDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return null; 
  }
  return date.toISOString(); 
}

export function convertAPIDateToDate(isoString) {
  if (typeof isoString !== "string") {
    return null; 
  }
  const date = new Date(isoString);
  return isNaN(date) ? null : date; 
}

export function convertDateToMMDDYYYY(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return null;
  }

  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0'); 
  const year = date.getFullYear(); 
  return `${month}-${day}-${year}`;
}
