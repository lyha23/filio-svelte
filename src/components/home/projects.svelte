<script lang="ts">
	import { Linear, gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import {
		type IDesktop,
		NO_MOTION_PREFERENCE_QUERY,
	} from '../../routes/store';
	import ProjectTile from '../common/project-tile.svelte';
	import { MENULINKS, PROJECTS } from '$lib/constants';
	import { onDestroy, onMount } from 'svelte';

	export let isDesktop: boolean;

	let targetSectionRef: HTMLElement;
	let sectionTitleElementRef: HTMLDivElement;
	let willChange = false;
	let horizontalAnimationEnabled = false;

	const initRevealAnimation = (
		targetSectionRef: HTMLElement,
	): [GSAPTimeline, ScrollTrigger] => {
		const revealTl = gsap.timeline({ defaults: { ease: Linear.easeNone } });
		revealTl.from(
			targetSectionRef.querySelectorAll('.seq'),
			{ opacity: 0, duration: 0.5, stagger: 0.5 },
			'<',
		);

		const scrollTrigger = ScrollTrigger.create({
			trigger: targetSectionRef,
			start: 'top bottom',
			end: 'bottom bottom',
			scrub: 0,
			animation: revealTl,
		});
		return [revealTl, scrollTrigger];
	};

	const initProjectsAnimation = (
		targetSectionRef: HTMLElement,
		sectionTitleElementRef: HTMLDivElement,
	): [GSAPTimeline, ScrollTrigger] => {
		const timeline = gsap.timeline({ defaults: { ease: Linear.easeNone } });
		const sidePadding =
			document.body.clientWidth -
			targetSectionRef.querySelector('.inner-container')!.clientWidth;

		const elementWidth =
			sidePadding +
			targetSectionRef.querySelector('.project-wrapper')!.clientWidth;
		targetSectionRef.style.width = `${elementWidth}px`;
		const width = window.innerWidth - elementWidth;
		const duration = `${(elementWidth / window.innerHeight) * 100}%`;
		timeline
			.to(targetSectionRef, { x: width })
			.to(sectionTitleElementRef, { x: -width }, '<');

		const scrollTrigger = ScrollTrigger.create({
			trigger: targetSectionRef,
			start: 'top top',
			end: duration,
			scrub: 0,
			pin: true,
			animation: timeline,
			pinSpacing: 'margin',
			onToggle: (self) => (willChange = self.isActive),
		});

		return [timeline, scrollTrigger];
	};

	let projectsScrollTrigger: ScrollTrigger | undefined;
	let projectsTimeline: GSAPTimeline | undefined;
	let revealTimeline: { progress: (arg0: number) => void };
	let revealScrollTrigger: { kill: () => void };

	onMount(() => {
		const { matches } = window.matchMedia(NO_MOTION_PREFERENCE_QUERY);
		horizontalAnimationEnabled = isDesktop && matches;
		if (isDesktop && matches) {
			[projectsTimeline, projectsScrollTrigger] = initProjectsAnimation(
				targetSectionRef,
				sectionTitleElementRef,
			);
		} else {
			const projectWrapper = targetSectionRef.querySelector(
				'.project-wrapper',
			) as HTMLDivElement;
			const parentPadding = window
				.getComputedStyle(targetSectionRef)
				.getPropertyValue('padding-left');
			targetSectionRef.style.setProperty('width', '100%');
			projectWrapper.classList.add('overflow-x-auto');
			projectWrapper.style.setProperty('width', `calc(100vw)`);
			projectWrapper.style.setProperty('padding', `0 ${parentPadding}`);
			projectWrapper.style.setProperty(
				'transform',
				`translateX(-${parentPadding})`,
			);
		}
		[revealTimeline, revealScrollTrigger] =
			initRevealAnimation(targetSectionRef);
	});
	onDestroy(() => {
		projectsScrollTrigger && projectsScrollTrigger.kill();
		projectsTimeline && projectsTimeline.kill();
		revealScrollTrigger && revealScrollTrigger.kill();
		revealTimeline && revealTimeline.progress(1);
	});

	const { ref: projectsSectionRef } = MENULINKS[1];
</script>

<section
	bind:this="{targetSectionRef}"
	class:min-h-screen="{isDesktop}"
	class="w-full relative select-none section-container flex-col flex py-8 justify-center"
	id="{projectsSectionRef}"
>
	<div
		class="flex flex-col inner-container"
		class:will-change-transform="{willChange}"
		bind:this="{sectionTitleElementRef}"
	>
		<p class="section-title-sm seq">PLATFORM</p>
		<h1 class="section-heading seq mt-2">平台优势</h1>
		<h2 class="seq mt-2 max-w-sm w-full text-2xl md:max-w-3xl">
			I have contributed in over 20+ projects ranging from Frontend development,
			UI/UX design, Open Source, and Motion Graphics
		</h2>
	</div>
	<div
		class="tall:mt-12 mt-6 grid grid-flow-col auto-cols-max md:gap-10 gap-6 project-wrapper w-fit seq snap-x scroll-pl-6 snap-mandatory"
	>
		{#each PROJECTS as project}
			<ProjectTile {project} animationEnabled="{horizontalAnimationEnabled}"
			></ProjectTile>
		{/each}
	</div>
</section>

<style scoped>
	.min-h-screen {
		@apply min-h-screen;
	}
</style>
