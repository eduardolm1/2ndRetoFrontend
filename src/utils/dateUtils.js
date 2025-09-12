export function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Ahora';
    if (diffMin < 60) return `${diffMin} minuto${diffMin === 1 ? '' : 's'}`;
    if (diffHour < 24) return `${diffHour} hora${diffHour === 1 ? '' : 's'}`;
    if (diffDay === 1) return 'ayer';
    if (diffDay < 7) return `${diffDay} día${diffDay === 1 ? '' : 's'}`;
    return date.toLocaleDateString();
}