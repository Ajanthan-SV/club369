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
    return normalizedPath;
};
