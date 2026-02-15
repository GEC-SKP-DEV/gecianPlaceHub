// Utility function to invalidate the categories cache
export const invalidateCategoriesCache = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cachedCategories');
  }
};

// Utility function to refetch categories from the server
export const refetchCategories = async () => {
  invalidateCategoriesCache();
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to refetch categories:', error);
    return null;
  }
};
