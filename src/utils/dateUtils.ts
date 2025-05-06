export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatStatusBadge = (status: string): {
  color: string;
  bgColor: string;
  text: string;
} => {
  switch (status) {
    case 'tertunda':
      return {
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        text: 'Menunggu Persetujuan'
      };
    case 'disetujui':
      return {
        color: 'text-green-800',
        bgColor: 'bg-green-100',
        text: 'Disetujui'
      };
    case 'ditolak':
      return {
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        text: 'Ditolak'
      };
    default:
      return {
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        text: 'Status Tidak Diketahui'
      };
  }
};