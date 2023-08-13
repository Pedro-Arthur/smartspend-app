export const formatDate = (date, type) => {
  if (!date) {
    return date;
  }

  if (type === 'YYYY-MM-DD') {
    return date
      .toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      .split('/')
      .reverse()
      .join('-');
  }

  if (type === 'DD/MM/YYYY') {
    return date.split('-').reverse().join('/');
  }

  return null;
};
