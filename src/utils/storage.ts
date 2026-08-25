export function getStoredBoolean(key: string, defaultValue: boolean): boolean {
  const value = localStorage.getItem(key);

  if (value === null) {
    return defaultValue;
  }

  return value === "true";
}

export function getStoredString(key: string, defaultValue: string): string {
  return localStorage.getItem(key) ?? defaultValue;
}
