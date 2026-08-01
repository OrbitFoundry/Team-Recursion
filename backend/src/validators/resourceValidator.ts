const VALID_CATEGORIES = ['DSA', 'Aptitude', 'Resume', 'Interview Experience', 'Core Subjects'];

export const validateCreateResource = (data: {
  title?: string;
  category?: string;
  link?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 1) {
    errors.push('Title is required');
  }

  if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (!data.link || data.link.trim().length < 1) {
    errors.push('Link is required');
  } else {
    try {
      new URL(data.link);
    } catch {
      errors.push('Link must be a valid URL');
    }
  }

  return { isValid: errors.length === 0, errors };
};
