import { PasswordCategory, CustomCategory } from '@/types';

export function getCategoryLabel(category: PasswordCategory, customCategories: CustomCategory[], customCategoryId?: string): string {
  // Check if it's a custom category
  if (customCategoryId) {
    const customCategory = customCategories.find(c => c.id === customCategoryId);
    if (customCategory) {
      return customCategory.name;
    }
  }

  const labels: Record<PasswordCategory, string> = {
    [PasswordCategory.SOCIAL_MEDIA]: 'Sosyal Medya',
    [PasswordCategory.EMAIL]: 'E-posta',
    [PasswordCategory.BANKING]: 'Bankacılık',
    [PasswordCategory.SHOPPING]: 'Alışveriş',
    [PasswordCategory.WORK]: 'İş',
    [PasswordCategory.ENTERTAINMENT]: 'Eğlence',
    [PasswordCategory.EDUCATION]: 'Eğitim',
    [PasswordCategory.GAMING]: 'Oyun',
    [PasswordCategory.HEALTH]: 'Sağlık',
    [PasswordCategory.TRAVEL]: 'Seyahat',
    [PasswordCategory.OTHER]: 'Diğer'
  };
  return labels[category] || 'Diğer';
}

export function getCategoryColor(category: PasswordCategory, customCategories: CustomCategory[], customCategoryId?: string): string {
  // Check if it's a custom category
  if (customCategoryId) {
    const customCategory = customCategories.find(c => c.id === customCategoryId);
    if (customCategory) {
      return customCategory.color;
    }
  }

  // Default colors for predefined categories
  const colors: Record<PasswordCategory, string> = {
    [PasswordCategory.SOCIAL_MEDIA]: '#3B82F6',
    [PasswordCategory.EMAIL]: '#10B981',
    [PasswordCategory.BANKING]: '#EF4444',
    [PasswordCategory.SHOPPING]: '#F59E0B',
    [PasswordCategory.WORK]: '#8B5CF6',
    [PasswordCategory.ENTERTAINMENT]: '#EC4899',
    [PasswordCategory.EDUCATION]: '#06B6D4',
    [PasswordCategory.GAMING]: '#84CC16',
    [PasswordCategory.HEALTH]: '#F97316',
    [PasswordCategory.TRAVEL]: '#6366F1',
    [PasswordCategory.OTHER]: '#6B7280'
  };
  return colors[category] || '#6B7280';
}

