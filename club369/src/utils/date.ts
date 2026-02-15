/**
 * Formats an ISO date string to DD-MM-YYYY
 * @param dateStr ISO date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (dateStr: string | Date | null | undefined): string => {
    if (!dateStr) return 'N/A';

    try {
        const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

        if (isNaN(date.getTime())) return 'N/A';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    } catch (e) {
        return 'N/A';
    }
};
