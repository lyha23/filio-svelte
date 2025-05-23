<script lang="ts">
	import { Linear, gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { isSmallScreen } from '../../routes/store';
	import {
		Branch,
		type BranchNode,
		type CheckpointNode,
		ItemSize,
		MENULINKS,
		NodeTypes,
		TIMELINE,
		type TimelineNodeV2,
	} from '$lib/constants';
	import { onMount } from 'svelte';

	const svgColor = '#9CA3AF';
	const animColor = '#FCD34D';
	const separation = 450;
	const leftBranchX = 13;
	const curveLength = 150;
	const dotSize = 26;

	const addNodeRefsToItems = (
		timeline: Array<TimelineNodeV2>,
	): Array<LinkedTimelineNode> => {
		return timeline.map((node, idx) => ({
			...node,
			next: timeline[idx + 1],
			prev: timeline[idx - 1],
		}));
	};

	const getDotString = (x: number, y: number) => {
		return `<rect class='dot' width=${dotSize} height=${dotSize} fill='#111827' x=${
			x - dotSize / 2
		} y=${
			y - dotSize / 2
		} ></rect><circle cx=${x} cy=${y} r='7' stroke=${svgColor} class='dot' ></circle>`;
	};

	const drawDot = (
		timelineNode: LinkedCheckpointNode,
		y: number,
		isDiverged: boolean,
	) => {
		const { next, alignment } = timelineNode as LinkedCheckpointNode;
		// Diverging
		if (next && next.type === NodeTypes.DIVERGE) {
			y = y - curveLength + 6 * dotSize;
		}
		// Converging
		if (next && next.type === NodeTypes.CONVERGE) {
			y = y + curveLength - 6 * dotSize;
		}
		const dotString = getDotString(
			alignment === Branch.LEFT ? leftBranchX : rightBranchX,
			y,
		);
		const textString = addText(timelineNode, y, isDiverged);
		return `${textString}${dotString}`;
	};

	const addText = (
		timelineNode: LinkedCheckpointNode,
		y: number,
		isDiverged: boolean,
	) => {
		const { title, subtitle, size, image } = timelineNode;
		const offset = isDiverged ? rightBranchX : 10;
		const foreignObjectX = dotSize / 2 + 10 + offset;
		const foreignObjectY = y - dotSize / 2;
		const foreignObjectWidth = svgWidth - (dotSize / 2 + 10 + offset);

		const titleSizeClass =
			size === ItemSize.LARGE ? 'class="text-6xl"' : 'class="text-2xl"';
		const pString = `<p ${titleSizeClass}> ${title}</p>`;
		const logoString = image
			? `<img src='${image}' class='h-8 mb-2' loading='lazy' width='100' height='32' alt='${image}' />`
			: '';
		const subtitleString = subtitle
			? `<p class='text-xl mt-2 text-gray-200 font-medium tracking-wide'>${subtitle}</p>`
			: '';

		return `<foreignObject x=${foreignObjectX} y=${foreignObjectY} width=${foreignObjectWidth}
        height=${separation}>${logoString} ${pString}${subtitleString}</foreignObject>`;
	};

	const drawLine = (
		timelineNode: LinkedCheckpointNode,
		y: number,
		i: number,
		isDiverged: boolean,
	) => {
		const { alignment, prev, next } = timelineNode as LinkedCheckpointNode;
		const isPrevDiverge = prev && prev.type === NodeTypes.DIVERGE;
		const isNextConverge = next && next.type === NodeTypes.CONVERGE;
		const lineY = Math.abs(y + separation);
		// Smaller line for Diverging
		if (isPrevDiverge) {
			return `<line class='str' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${animColor} />`;
		}
		// Smaller line for Converging
		if (isNextConverge) {
			return `<line class='str' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${animColor} />`;
		}
		const lineX = alignment === Branch.LEFT ? leftBranchX : rightBranchX;
		let str = `<line class='str' x1=${lineX} y1=${y} x2=${lineX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${lineX} y1=${y} x2=${lineX} y2=${lineY} stroke=${animColor} />`;
		// If already diverged, draw parallel line to the existing line
		if (isDiverged) {
			const divergedLineX =
				alignment === Branch.LEFT ? rightBranchX : leftBranchX;
			str = str.concat(
				`<line class='str' x1=${divergedLineX} y1=${y} x2=${divergedLineX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${divergedLineX} y1=${y} x2=${divergedLineX} y2=${lineY} stroke=${animColor} />`,
			);
		}
		return str;
	};

	const drawBranch = (timelineNode: LinkedBranchNode, y: number, i: number) => {
		const { type } = timelineNode;
		switch (type) {
			case NodeTypes.DIVERGE:
				return `<path class='str' d='M ${leftBranchX} ${y} C ${leftBranchX} ${
					y + curveLength / 2
				} ${rightBranchX} ${y + curveLength / 2} ${rightBranchX} ${
					y + curveLength
				}' stroke=${svgColor} /><line class='str' x1=${rightBranchX} y1=${
					y + curveLength
				} x2=${rightBranchX} y2=${
					y + separation
				} stroke=${svgColor} /><path class='str anim-branch branch-${i}' d='M ${leftBranchX} ${y} C ${leftBranchX} ${
					y + curveLength / 2
				} ${rightBranchX} ${y + curveLength / 2} ${rightBranchX} ${
					y + curveLength
				}' stroke=${animColor} /><line class='str branch-line-${i}' x1=${rightBranchX} y1=${
					y + curveLength
				} x2=${rightBranchX} y2=${y + separation} stroke=${animColor} />`;
			case NodeTypes.CONVERGE:
				return `<path class='str' d='M ${rightBranchX} ${
					y + separation - curveLength
				} C ${rightBranchX} ${
					y + separation - curveLength + curveLength / 2
				} ${leftBranchX} ${
					y + separation - curveLength + curveLength / 2
				} ${leftBranchX} ${
					y + separation
				}' stroke=${svgColor} /><line class='str' x1=${rightBranchX} y1=${y} x2=${rightBranchX} y2=${Math.abs(
					y + separation - curveLength,
				)} stroke=${svgColor} /><path class='str anim-branch branch-${i}' d='M ${rightBranchX} ${
					y + separation - curveLength
				} C ${rightBranchX} ${
					y + separation - curveLength + curveLength / 2
				} ${leftBranchX} ${
					y + separation - curveLength + curveLength / 2
				} ${leftBranchX} ${
					y + separation
				}' stroke=${animColor} /><line class='str branch-line-${i}' x1=${rightBranchX} y1=${y} x2=${rightBranchX} y2=${Math.abs(
					y + separation - curveLength,
				)} stroke=${animColor} />`;
			default:
				return '';
		}
	};

	const generateTimelineSvg = (timeline: Array<TimelineNodeV2>) => {
		let index = 1;
		let y = dotSize / 2;
		const timelineStyle = ``;
		let isDiverged = false;
		const timelineSvg = addNodeRefsToItems(timeline).reduce(
			(svg: string, node: LinkedTimelineNode) => {
				const { type, next } = node;
				let lineY = y;
				let dotY = y + separation / 2;
				switch (type) {
					case NodeTypes.CHECKPOINT:
						{
							const { shouldDrawLine } = node;
							// special handling for last checkpoint
							if (!next) {
								lineY = y - separation / 2;
							}
							// special handling for dot without line
							if (!shouldDrawLine) {
								dotY = y;
							}
							if (shouldDrawLine) {
								// TO DO fix syntax
								svg = shouldDrawLine
									? `${drawLine(node, lineY, index, isDiverged)}${svg}`
									: svg;
								y = y + separation;
								index++;
							}
							svg = svg.concat(drawDot(node, dotY, isDiverged));
						}
						break;
					case NodeTypes.DIVERGE:
						{
							isDiverged = true;
							svg = `${drawBranch(node, y, index)}${svg}`;
						}
						break;
					case NodeTypes.CONVERGE:
						{
							isDiverged = false;
							// Drawing CONVERGE branch with previous line and index
							svg = `${drawBranch(node, y - separation, index - 1)}${svg}`;
						}
						break;
				}
				return svg;
			},
			timelineStyle,
		);
		return timelineSvg;
	};

	const addLineSvgAnimation = (
		timeline: GSAPTimeline,
		duration: number,
		index: number,
	): GSAPTimeline => {
		const startTime = `start+=${duration * index}`;
		timeline.from(
			svgContainer.querySelectorAll(`.line-${index + 1}`),
			{ scaleY: 0, duration },
			startTime,
		);
		return timeline;
	};

	const addDivergingBranchLineAnimation = (
		timeline: GSAPTimeline,
		duration: number,
		index: number,
	): GSAPTimeline => {
		timeline
			.from(
				svgContainer.querySelector(`.line-${index + 1}`),
				{ scaleY: 0, duration },
				`start+=${duration * index}`,
			)
			.from(
				svgContainer.querySelector(`.branch-${index + 1}`),
				{ strokeDashoffset: 186, duration: duration - 2 },
				`start+=${duration * index}`,
			)
			.from(
				svgContainer.querySelector(`.branch-line-${index + 1}`),
				{ scaleY: 0, duration: duration - 1 },
				`start+=${duration * (index + 1) - 2}`,
			);
		return timeline;
	};

	const addConvergingBranchLineAnimation = (
		timeline: GSAPTimeline,
		duration: number,
		index: number,
	): GSAPTimeline => {
		timeline
			.from(
				svgContainer.querySelector(`.line-${index + 1}`),
				{ scaleY: 0, duration },
				`start+=${duration * index}`,
			)
			.from(
				svgContainer.querySelector(`.branch-line-${index + 1}`),
				{ scaleY: 0, duration: duration - 1 },
				`start+=${duration * index}`,
			)
			.from(
				svgContainer.querySelector(`.branch-${index + 1}`),
				{ strokeDashoffset: 186, duration: duration - 2 },
				`start+=${duration * (index + 1) - 1}`,
			);

		return timeline;
	};

	const animateTimeline = (timeline: GSAPTimeline, duration: number): void => {
		let index = 0;
		addNodeRefsToItems(TIMELINE).forEach((item) => {
			const { type } = item;
			if (type === NodeTypes.CHECKPOINT && item.shouldDrawLine) {
				const { next, prev } = item;

				if (prev?.type === NodeTypes.DIVERGE) {
					addDivergingBranchLineAnimation(timeline, duration, index);
				} else if (next?.type === NodeTypes.CONVERGE) {
					addConvergingBranchLineAnimation(timeline, duration, index);
				} else {
					addLineSvgAnimation(timeline, duration, index);
				}
				index++;
			}
		});
	};

	const setTimelineSvg = (
		svgContainer: HTMLDivElement,
		timelineSvg: SVGSVGElement,
	) => {
		const containerWidth = svgContainer.clientWidth;
		svgWidth = containerWidth;
		const resultSvgString = generateTimelineSvg(TIMELINE);
		timelineSvg.innerHTML = resultSvgString;
		if (isSmallScreen()) {
			rightBranchX = 70;
		}
	};

	const setSlidesAnimation = (timeline: GSAPTimeline): void => {
		svgCheckpointItems.forEach((_, index) => {
			// all except the first slide
			if (index !== 0) {
				timeline.fromTo(
					screenContainer.querySelector(`.slide-${index + 1}`),
					{ opacity: 0 },
					{ opacity: 1 },
				);
			}

			// all except the last slide
			if (index !== svgCheckpointItems.length - 1) {
				timeline.to(screenContainer.querySelector(`.slide-${index + 1}`), {
					opacity: 0,
					delay: 2.35,
				});
			}
		});
	};

	const initScrollTrigger = (): {
		timeline: GSAPTimeline;
		duration: number;
	} => {
		const timeline = gsap
			.timeline({ defaults: { ease: Linear.easeNone, duration: 0.44 } })
			.addLabel('start');

		let duration: number;
		let trigger: HTMLDivElement;
		let start: string;
		let end: string;
		let additionalConfig = {};

		// Slide as a trigger for Desktop
		if (isDesktop && !isSmallScreen()) {
			// Animation for right side slides
			setSlidesAnimation(timeline);

			const platformHeight = screenContainer.getBoundingClientRect().height;

			trigger = screenContainer;
			start = `top ${(window.innerHeight - platformHeight) / 2}`;
			end = `+=${svgLength - platformHeight}`;
			additionalConfig = {
				pin: true,
				pinSpacing: true,
			};
			duration = timeline.totalDuration() / 15;
		} else {
			// Clearing out the right side on mobile devices
			screenContainer.innerHTML = '';
			trigger = svgContainer;
			start = 'top center';
			end = `+=${svgLength}`;
			duration = 3;
		}
		ScrollTrigger.create({
			...additionalConfig,
			trigger,
			start,
			end,
			scrub: 0,
			animation: timeline,
		});
		return { timeline, duration };
	};

	export let isDesktop: boolean;
	let svgWidth = 400;
	let rightBranchX = 109;
	const svgCheckpointItems = TIMELINE.filter(
		(item) => item.type === NodeTypes.CHECKPOINT && item.shouldDrawLine,
	) as CheckpointNode[];
	const svgLength = svgCheckpointItems?.length * separation;
	let timelineSvg: SVGSVGElement;
	let svgContainer: HTMLDivElement;
	let screenContainer: HTMLDivElement;

	onMount(() => {
		// Generate and set the timeline svg
		setTimelineSvg(svgContainer, timelineSvg);
		const { timeline, duration }: { timeline: GSAPTimeline; duration: number } =
			initScrollTrigger();
		// Animation for Timeline SVG
		animateTimeline(timeline, duration);
	});

	type LinkedTimelineNode = LinkedCheckpointNode | LinkedBranchNode;
	type LinkedCheckpointNode = LinkNode & CheckpointNode;
	type LinkedBranchNode = LinkNode & BranchNode;
	interface LinkNode {
		next?: LinkedTimelineNode;
		prev?: LinkedTimelineNode;
	}
</script>

<section
	class="section-container relative min-h-screen w-full flex flex-col select-none justify-center py-8"
	id="{MENULINKS[3].ref}"
>
	<div class="flex flex-col">
		<p class="section-title-sm seq">MILESTONES</p>
		<h1 class="section-heading seq mt-2">Timeline</h1>
		<h2 class="seq mt-2 w-full text-2xl md:max-w-2xl">
			A quick recap of proud moments
		</h2>
	</div>
	<div class="grid grid-cols-12 mt-20 gap-4">
		<div class="line-svg col-span-12 md:col-span-6" bind:this="{svgContainer}">
			<svg
				width="{svgWidth}"
				height="{svgLength}"
				viewBox="{`0 0 ${svgWidth} ${svgLength}`}"
				fill="none"
				bind:this="{timelineSvg}"
			></svg>
		</div>
		<div class="col-span-12 hidden md:col-span-6 md:flex">
			<div
				class="h-96 max-w-full overflow-hidden rounded-2xl bg-gray-800 shadow-xl"
				bind:this="{screenContainer}"
			>
				<img
					class="h-8 w-full"
					src="/timeline/title-bar.svg"
					alt="Title bar"
					width="{644}"
					height="{34}"
				/>
				<div class="relative h-full w-full -mt-2">
					<div class="absolute left-0 top-0 h-full w-full">
						{#each svgCheckpointItems as item, index}
							<img
								class="{`w-full absolute top-0 object-cover slide-${
									index + 1
								}`}"
								src="{item.slideImage || ''}"
								alt="Timeline"
							/>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style scoped>
	.str,
	.dot {
		stroke-width: var(strokeWidth) px;
	}
	.anim-branch {
		stroke-dasharray: 186;
	}
	img {
		layout: cover;
	}
</style>
