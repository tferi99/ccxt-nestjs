export function queryParamToBool(value: string, defaultValue: boolean): boolean {
  if (!value) {
    return defaultValue;
  }
  return ((value + '').toLowerCase() === 'true');
}
