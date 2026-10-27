export const emailPattern = /^[^\s@\u0000-\u001f\u007f]+@[^\s@\u0000-\u001f\u007f]+$/
export const positiveIdPattern = /^[1-9]\d*$/
export const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/
export const unsignedIntegerPattern = /^\d+$/
export const bearerTokenPattern = /^Bearer ([^\s]+)$/i
export const placeholderSecretPattern = /^(replace[_ -]|your[_ -]|change[_ -]?me)/i
export const repeatedSecretPattern = /^(.{1,16})\1+$/
export const controlCharactersPattern = /[\u0000-\u001f\u007f]/

// Use the global variant for replacement, not stateful .test() calls.
export const controlCharactersGlobalPattern = /[\u0000-\u001f\u007f]/g

export const isValidId = (value: unknown): value is string => typeof value === 'string' &&
  value.length <= 19 && positiveIdPattern.test(value) && BigInt(value) <= 9223372036854775807n
