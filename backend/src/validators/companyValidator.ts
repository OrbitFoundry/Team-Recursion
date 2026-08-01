const VALID_STATUSES = ['Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected'];

export const validateCreateCompany = (data: {
  companyName?: string;
  role?: string;
  applicationDate?: string;
  status?: string;
  companyLink?: string;
  techStacks?: string[];
  notes?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.companyName || data.companyName.trim().length < 1) {
    errors.push('Company name is required');
  }

  if (!data.role || data.role.trim().length < 1) {
    errors.push('Job role is required');
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (data.applicationDate && isNaN(Date.parse(data.applicationDate))) {
    errors.push('Application date must be a valid date');
  }

  if (data.companyLink && !/^https?:\/\/.+/.test(data.companyLink)) {
    errors.push('Company link must be a valid URL starting with http:// or https://');
  }

  if (data.techStacks !== undefined) {
    if (!Array.isArray(data.techStacks)) {
      errors.push('Tech stacks must be an array of strings');
    }
  }

  return { isValid: errors.length === 0, errors };
};

export const validateUpdateCompany = (data: {
  companyName?: string;
  role?: string;
  applicationDate?: string;
  status?: string;
  companyLink?: string;
  techStacks?: string[];
  notes?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (data.companyName !== undefined && data.companyName.trim().length < 1) {
    errors.push('Company name cannot be empty');
  }

  if (data.role !== undefined && data.role.trim().length < 1) {
    errors.push('Job role cannot be empty');
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (data.applicationDate && isNaN(Date.parse(data.applicationDate))) {
    errors.push('Application date must be a valid date');
  }

  if (data.companyLink && !/^https?:\/\/.+/.test(data.companyLink)) {
    errors.push('Company link must be a valid URL starting with http:// or https://');
  }

  if (data.techStacks !== undefined) {
    if (!Array.isArray(data.techStacks)) {
      errors.push('Tech stacks must be an array of strings');
    }
  }

  return { isValid: errors.length === 0, errors };
};
