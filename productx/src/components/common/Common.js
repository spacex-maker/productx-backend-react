
const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};















export { formatDate }
