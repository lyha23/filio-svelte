<script lang="ts">
	import { browser } from '$app/environment';
  import { isLoading } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import '$lib/i18n';
  import Modal from '../components/modals/install_prompt/index.svelte';

  let isModalOpen = false;
  let deferredPrompt: BeforeInstallPromptEvent | undefined;

  const showInstallPrompt = () => {
    isModalOpen = true;
  };

  const toggleModal = () => {
    isModalOpen = !isModalOpen;
  };

  const installApp = () => {
    deferredPrompt?.prompt();

    deferredPrompt?.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        localStorage.removeItem('install-denied');
        toggleModal();
      }
    });
  };

  const installDenied = () => {
    // Store the user's preference
    localStorage.setItem('install-denied', 'true');
    toggleModal();
  };

  onMount(() => {
    if (browser){
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      // Remove the stored preference
      localStorage.removeItem('install-denied');
    }
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the default install prompt
      event.preventDefault();
      const isInstalled = window.matchMedia(
        '(display-mode: standalone)',
      ).matches;
      const isInstallDenied = localStorage.getItem('install-denied') === 'true';
      // Do not show the prompt if the app is already installed or install was denied
      if (isInstalled || isInstallDenied) {
        return;
      }
      // Store the event for later use
      deferredPrompt = event as BeforeInstallPromptEvent;
      showInstallPrompt();
    });
    }
  });
</script>

{#if $isLoading}
  <main>
    <p aria-busy="true">Please wait...</p>
  </main>
{:else}
  <main>
    <slot />
  </main>
  <Modal
    isOpen="{isModalOpen}"
    onClose="{toggleModal}"
    onInstall="{installApp}"
    onInstallDenied="{installDenied}"
  />
{/if}

<style>
  @import '../styles/globals.scss';
  main {
    /* background-image: url('/bg.png'); */
    font-family: 'Google Sans', Avenir, ui-sans-serif, 'system-ui',
      '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
      '"Helvetica Neue"', 'Arial', '"Noto Sans"', sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji', Helvetica, Arial, sans-serif;
  }
</style>
