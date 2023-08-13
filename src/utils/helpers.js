export const formatDate = (date) => {
  if (!date) {
    return date;
  }

  return date
    .toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    .split('/')
    .reverse()
    .join('-');
};
