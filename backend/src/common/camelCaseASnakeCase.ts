export function camelCaseASnakeCase(keyAConvertir: string) {
  let camelCaseString = keyAConvertir;
  let miString = camelCaseString.split(/(?=[A-Z])/);
  let snakeCaseString = miString.join('_').toLowerCase();

  return snakeCaseString;
}