/**
 * Environment variables validation and configuration
 */

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_RPC_URL',
  'NEXT_PUBLIC_NETWORK',
] as const;

// Validate that all required environment variables are present
function validateEnv(): void {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Validate environment on module load
validateEnv();

export const env = {
  // Gorbagana Configuration
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL!,
  NETWORK: process.env.NEXT_PUBLIC_NETWORK!,
  
  // API Configuration (optional for now)
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
  
  // App Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Feature flags
  ENABLE_SOUND: process.env.NEXT_PUBLIC_ENABLE_SOUND === 'true',
  ENABLE_ANIMATIONS: process.env.NEXT_PUBLIC_ENABLE_ANIMATIONS !== 'false',
} as const;

// Type-safe environment configuration
export type Environment = typeof env;