/**
 * Validate required environment variables on server startup
 * This ensures the application fails fast if critical configuration is missing
 */
const validateEnv = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT',
    'CORS_ORIGIN',
  ];

  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error('ERROR: Missing required environment variables:');
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    console.error('See .env.example for reference.\n');
    process.exit(1);
  }

  // Validate JWT_SECRET is not using default/weak value
  const weakSecrets = [
    'your-super-secret-jwt-key-CHANGE-THIS-IN-PRODUCTION',
    'your-secret-key-change-this-in-production',
    'change-me',
    'secret',
    'password',
  ];

  if (weakSecrets.includes(process.env.JWT_SECRET)) {
    console.error('ERROR: JWT_SECRET is using a default or weak value!');
    console.error('Please generate a strong secret key.');
    console.error(
      'Run: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"\n'
    );

    // Allow weak secrets in development mode only
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('WARNING: Weak JWT_SECRET detected in development mode. This is NOT safe for production!\n');
    }
  }

  // Validate JWT_SECRET has minimum length
  if (process.env.JWT_SECRET.length < 32) {
    console.error('ERROR: JWT_SECRET must be at least 32 characters long!');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('WARNING: JWT_SECRET is too short for production use!\n');
    }
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv;
