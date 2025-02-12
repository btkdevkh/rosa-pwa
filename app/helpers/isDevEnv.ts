export function isDevEnv() {
  // Dev localhost
  if (
    process.env.NODE_ENV === "development" &&
    global?.window?.location.origin === `http://localhost:3000`
  ) {
    return true;
  }

  // Prod but localhost
  if (
    process.env.NODE_ENV === "production" &&
    global?.window?.location.origin === `http://localhost:3000`
  ) {
    return false;
  }

  // Dev url
  if (
    global?.window?.location.origin ===
    `https://rospot-dev-528742997345.europe-west1.run.app`
  ) {
    return false;
  }

  // Test url
  if (
    global?.window?.location.origin ===
    `https://rospot-test-528742997345.europe-west1.run.app`
  ) {
    return false;
  }

  return false;
}
