<script lang="ts">
  import { EMAIL, MENULINKS, SOCIAL_LINKS } from '$lib/constants';
  import Button from './button.svelte';
  import { ButtonTypes } from './button.store';

  let { ref: footerRef } = MENULINKS[4];

  function gotoGov() {
		window.location.href = 'https://beian.miit.gov.cn/'
	}
</script>

<footer
  class="w-full relative select-none bg-cover flex flex-col items-stretch"
  id="{footerRef}"
>
  <img
    src="/footer-curve.svg"
    alt="Footer"
    class="w-full"
    loading="lazy"
    height="{290}"
    role="presentation"
    width="{1440}"
  />
  <div class="h-full w-full">
    <div
      class="section-container flex-col flex h-full justify-end z-10 items-center py-12"
    >
      <h1 class="font-medium text-3xl md:text-4xl text-center">
        Connect with me on social media.
      </h1>
      <div class="flex mt-8">
        {#each Object.keys(SOCIAL_LINKS) as el}
          <a
            href="{SOCIAL_LINKS[el]}"
            class="link hover:opacity-80 duration-300 md:px-2 px-1"
            rel="noreferrer"
            target="_blank"
          >
            <img
              src="{`/social/${el}.svg`}"
              alt="{el}"
              width="{40}"
              height="{40}"
            />
          </a>
        {/each}
      </div>
      <div class="flex mt-8">
        <Button
          classes="mr-3"
          type="{ButtonTypes.OUTLINE}"
          name="Resume"
          otherProps="{{
            target: '_blank',
            rel: 'noreferrer',
          }}"
          href="/Ayush_Resume.pdf"
        ></Button>
        <Button
          classes="ml-3"
          type="{ButtonTypes.WHITE}"
          name="Let's Talk"
          href="{SOCIAL_LINKS.topmate}"
          otherProps="{{
            target: '_blank',
            rel: 'noreferrer',
          }}"
        ></Button>
      </div>
      <h2 class="text-center text-sm sm:text-base mt-8">
        <div class="p-5 flex justify-end fixed bottom-0">
          <div class="mt-8 text-start">
            <span class="icon-banquan iconfont"
            ></span>
            <button onclick={gotoGov} class="block">沪ICP备2022004472号-2</button>
          </div>
        </div>
      </h2>
    </div>
  </div>
</footer>
