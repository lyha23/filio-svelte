// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// PWA Install Prompt Event Types
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export {};
