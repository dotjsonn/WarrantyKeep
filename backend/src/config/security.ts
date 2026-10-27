import 'dotenv/config'
import { placeholderSecretPattern, repeatedSecretPattern } from '../utils/validationPatterns.js'

const runtimeEnvironment = process.env.NODE_ENV ?? 'development'
if (!['production', 'development', 'test'].includes(runtimeEnvironment)) {
  throw new Error('NODE_ENV must be production, development, or test.')
}
const isProduction = runtimeEnvironment === 'production'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret || jwtSecret !== jwtSecret.trim() || Buffer.byteLength(jwtSecret, 'utf8') < 32 ||
  placeholderSecretPattern.test(jwtSecret) || repeatedSecretPattern.test(jwtSecret)) {
  throw new Error('JWT_SECRET must contain at least 32 random bytes and must not be a placeholder or repeated pattern.')
}

const configuredOrigins = process.env.FRONTEND_ORIGIN ?? (isProduction ? '' : 'http://localhost:5173')
const frontendOrigins = configuredOrigins
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

if (frontendOrigins.length === 0) {
  throw new Error('FRONTEND_ORIGIN must be configured.')
}

for (const origin of frontendOrigins) {
  const url = new URL(origin)
  if (url.origin !== origin || !['http:', 'https:'].includes(url.protocol)) {
    throw new Error('FRONTEND_ORIGIN must contain only valid HTTP origins without paths.')
  }
  if (isProduction && url.protocol !== 'https:') {
    throw new Error('FRONTEND_ORIGIN must use HTTPS in production.')
  }
}

const securityConfig = {
  isProduction,
  jwtSecret,
  jwtAlgorithm: 'HS256' as const,
  jwtIssuer: 'warrantykeep-api',
  jwtAudience: 'warrantykeep-web',
  jwtLifetimeSeconds: 30 * 60,
  frontendOrigins: new Set(frontendOrigins)
}

export { securityConfig }
