/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMAZON_ASSOCIATE_TAG?: string;
  readonly VITE_API_URL?: string;
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

