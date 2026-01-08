export {};

declare global {
  interface Window {
    ENV: {
      VITE_API_URL?: string;
      VITE_BACKEND_URL?: string;
    };
  }
}
