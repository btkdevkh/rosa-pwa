export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js") // This should match the file in the public folder
      .then(registration => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch(error => {
        console.error("Service Worker registration failed:", error);
      });
  }
}
