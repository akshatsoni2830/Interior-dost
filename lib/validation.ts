/**
 * Input validation utilities for file uploads
 * Requirements: 1.1, 1.3
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file type against allowed types
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types (e.g., ['image/jpeg', 'image/png'])
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): ValidationResult {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  return { valid: true };
}

/**
 * Validates file size against maximum size in MB
 * @param file - File to validate
 * @param maxMB - Maximum file size in megabytes
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateFileSize(
  file: File,
  maxMB: number
): ValidationResult {
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxMB}MB limit`,
    };
  }
  return { valid: true };
}

/**
 * Validates image file for upload (combines type and size validation)
 * Requirements: 1.1 (jpg/png only), 1.3 (max 10MB)
 * @param file - File to validate
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateImageFile(file: File): ValidationResult {
  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSizeMB = 10;

  // Check file type first
  const typeValidation = validateFileType(file, allowedTypes);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  // Check file size
  const sizeValidation = validateFileSize(file, maxSizeMB);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  return { valid: true };
}
