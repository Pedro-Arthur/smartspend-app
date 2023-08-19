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

export const getGreeting = () => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 6 && hour < 12) {
    return 'Bom dia';
  }
  if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  }
  return 'Boa noite';
};
