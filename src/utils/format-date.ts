function formatDate(date: string) {
  return `${date.substr(8, 2)}.${date.substr(5, 2)}.`
}

export default formatDate;
