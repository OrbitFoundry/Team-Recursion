export const validateTimelineEvent = (data: {
  title?: string;
  description?: string;
  date?: string;
}): { isValid: boolean; errors: { field: string; message: string }[] } => {
  const errors: { field: string; message: string }[] = [];

  if (!data.title || data.title.trim().length < 2) {
    errors.push({ field: 'title', message: 'Title is required and must be at least 2 characters' });
  } else if (data.title.length > 100) {
    errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
  }

  if (data.description && data.description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  if (!data.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else if (isNaN(Date.parse(data.date))) {
    errors.push({ field: 'date', message: 'Invalid date format' });
  }

  return { isValid: errors.length === 0, errors };
};
