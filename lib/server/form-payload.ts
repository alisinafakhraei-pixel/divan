/** Flattens a FormData into plain string fields, matching the shape SuggestFormField values are keyed by. File entries are skipped. */
export function payloadFromFormData(formData: FormData): Record<string, string> {
  const payload: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") payload[key] = value;
  }
  return payload;
}

export function getUploadedFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}
