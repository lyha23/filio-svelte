<script lang="ts">
	import { browser } from '$app/environment';
  import { METADATA } from '$lib/constants';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

  import Header from '../components/common/header.svelte';
  import ProgressIndicator from '../components/common/progress-indicator.svelte';
  import Cursor from '../components/common/cursor.svelte';
  import HeroSection from '../components/home/hero.svelte';
  import AboutSection from '../components/home/about.svelte';
  import ProjectsSection from '../components/home/projects.svelte';
  import QuoteSection from '../components/home/quote.svelte';
  import SkillsSection from '../components/home/skills.svelte';
  import TimelineSection from '../components/home/timeline.svelte';
  import CollaborationSection from '../components/home/collaboration.svelte';
  import Footer from '../components/common/footer.svelte';

  import { onMount, onDestroy } from 'svelte';
  import { DEBOUNCE_TIME } from './store';

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: true });

  let isDesktop = true;
  let timer: string | number | NodeJS.Timeout | undefined | null = null;

  const debouncedDimensionCalculator = () => {
    clearTimeout(timer!);
    timer = setTimeout(() => {
      const isDesktopResult =
        typeof window.orientation === 'undefined' &&
        navigator.userAgent.indexOf('IEMobile') === -1;
      window.history.scrollRestoration = 'manual';
      isDesktop = isDesktopResult;
    }, DEBOUNCE_TIME);
  };

  onMount(() => {
    browser&&debouncedDimensionCalculator();
    browser&&window.addEventListener('resize', debouncedDimensionCalculator);
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('resize', debouncedDimensionCalculator);
    }
  });
</script>

<svelte:head>
  <meta name="twitter:card" content="summary_large_image" />
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, shrink-to-fit=no"
  />
  <meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1" />
  <meta name="description" content="{METADATA.description}" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{METADATA.title}" />
  <meta property="og:description" content="{METADATA.description}" />
  <meta property="og:url" content="{METADATA.siteUrl}" />
  <meta property="og:site_name" content="{METADATA.title}" />
  <meta property="og:image" content="https://www.ayushsingh.net/preview.jpg" />
  <meta property="og:image:secure_url" content="{METADATA.siteUrl}" />
  <meta property="og:image:width" content="1440" />
  <meta property="og:image:height" content="800" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <title>{METADATA.title}</title>
</svelte:head>
<Header />
<ProgressIndicator />
<Cursor {isDesktop} />
<main class="flex-col flex">
  <div class="fixed top-0 left-0 h-screen w-screen bg-gray-900 -z-1"></div>
  <HeroSection />
  <AboutSection />
  <ProjectsSection {isDesktop} />
  <QuoteSection />
  <SkillsSection />
  <TimelineSection {isDesktop} />
  <CollaborationSection />
  <Footer />
</main>
