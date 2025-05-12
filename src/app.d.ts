/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    [key: string]: any;
  }
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
