/**
 * Normalizes backend URLs to ensure they work in both local development
 * and production/cloud storage environments.
 */
export const getFullUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;

    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return `${baseUrl}${normalizedPath}`;
};
