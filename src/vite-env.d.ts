/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';
  export type { RegisterSWOptions };
  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

declare module 'virtual:pwa-register/react' {
  import type { Dispatch, SetStateAction } from 'react';
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

  export function useRegisterSW(
    options?: RegisterSWOptions,
  ): {
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>];
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}
