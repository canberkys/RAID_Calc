export function formatCapacityBinary(tb: number): string {
  const gbValue = tb * 1024; // Convert TB to GB (binary)
  if (gbValue >= 1024) {
    return `${tb} TB (${gbValue.toLocaleString()} GiB)`;
  }
  return `${gbValue.toLocaleString()} GiB`;
}

export function formatCapacitySimple(tb: number): string {
  const gbValue = tb * 1024;
  return `${gbValue.toLocaleString()} GiB`;
}