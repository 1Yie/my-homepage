import { RiJavaLine } from 'react-icons/ri';
import {
	SiCss3,
	SiHtml5,
	SiJavascript,
	SiMysql,
	SiNextdotjs,
	SiNodedotjs,
	SiReact,
	SiTailwindcss,
	SiTypescript,
	SiVuedotjs,
} from 'react-icons/si';

import Project from '@/components/about/project';
import PageTitle from '@/components/page-title';
import { Carousel } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import TiltedCard from '@/components/ui/tilted-card';
import { useGetSlides } from '@/hooks/use-get-slides';

function SlidesLoader() {
	const { slides, loading, error } = useGetSlides();

	if (loading) {
		return (
			<div
				className="relative flex h-full min-h-[400px] w-full items-center
					justify-center overflow-hidden py-20"
			>
				<div className="h-[70vmin] w-[70vmin]">
					<Skeleton className="h-full w-full rounded-xl" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="relative flex h-full min-h-[400px] w-full items-center
					justify-center overflow-hidden py-20"
			>
				<p className="text-red-500">错误: {error}</p>
			</div>
		);
	}

	if (slides.length === 0) {
		return (
			<div
				className="relative flex h-full min-h-[400px] w-full items-center
					justify-center overflow-hidden py-20"
			>
				<p className="text-muted-foreground">暂无图片</p>
			</div>
		);
	}

	return (
		<div
			className="relative flex h-full min-h-[400px] w-full items-center
				justify-center overflow-hidden py-20"
		>
			<Carousel slides={slides} />
		</div>
	);
}

function SkillStack() {
	const skills = [
		{
			name: 'HTML',
			icon: <SiHtml5 className="h-6 w-6 text-orange-400 sm:h-12 sm:w-12" />,
		},
		{
			name: 'CSS',
			icon: <SiCss3 className="h-6 w-6 text-blue-400 sm:h-12 sm:w-12" />,
		},
		{
			name: 'JavaScript',
			icon: (
				<SiJavascript className="h-6 w-6 text-yellow-400 sm:h-12 sm:w-12" />
			),
		},
		{
			name: 'TypeScript',
			icon: <SiTypescript className="h-6 w-6 text-blue-500 sm:h-12 sm:w-12" />,
		},
		{
			name: 'Tailwind CSS',
			icon: <SiTailwindcss className="h-6 w-6 text-sky-400 sm:h-12 sm:w-12" />,
		},
		{
			name: 'React',
			icon: <SiReact className="h-6 w-6 text-cyan-400 sm:h-12 sm:w-12" />,
		},
		{
			name: 'Vue',
			icon: <SiVuedotjs className="h-6 w-6 text-green-600 sm:h-12 sm:w-12" />,
		},
		{
			name: 'Next.js',
			icon: (
				<SiNextdotjs
					className="h-6 w-6 text-black sm:h-12 sm:w-12 dark:text-white"
				/>
			),
		},
		{
			name: 'Node.js',
			icon: <SiNodedotjs className="h-6 w-6 text-green-700 sm:h-12 sm:w-12" />,
		},
		{
			name: 'Bun',
			icon: (
				<svg
					className="h-6 w-6 sm:h-12 sm:w-12"
					fill="currentColor"
					viewBox="0 0 80 70"
				>
					<path d="M51.6709 60.4406C52.9382 62.0696 54.8241 63.1175 56.9097 63.3139C60.3837 63.642 63.4576 61.1679 64.0858 57.7608C64.1856 57.218 64.1356 56.6617 63.9415 56.1458C63.7474 55.6299 63.4164 55.1718 62.9826 54.8183C62.5488 54.4648 62.0263 54.2278 61.4681 54.131C60.9098 54.0342 60.3344 54.0806 59.7993 54.2661C59.2643 54.4516 58.7868 54.7701 58.4116 55.1922C58.0363 55.6143 57.7758 56.1262 57.6549 56.6794C57.5339 57.2326 57.5566 57.8086 57.7204 58.3507C57.8843 58.8928 58.1839 59.3832 58.5925 59.7766C59.0011 60.17 59.5056 60.4542 60.0581 60.6024C60.6106 60.7506 61.193 60.758 61.7493 60.6239L62.0859 61.5976C61.3174 61.7813 60.5118 61.7705 59.7485 61.5662C58.9853 61.3618 58.2893 60.9713 57.7263 60.4317C57.1634 59.8921 56.7514 59.22 56.5295 58.478C56.3076 57.7361 56.2834 56.9476 56.4588 56.1934C56.6342 55.4391 57.0034 54.7436 57.5325 54.1713C58.0615 53.599 58.7337 53.1686 59.4856 52.9214C60.2375 52.6742 61.0437 52.6186 61.8259 52.7603C62.6081 52.902 63.3404 53.2362 63.9527 53.7319C64.565 54.2276 65.0372 54.8697 65.325 55.5981C65.6127 56.3266 65.7065 57.1176 65.5974 57.8937C64.8442 61.9879 61.1704 64.9417 56.9763 64.5406C54.4945 64.2941 52.2425 63.029 50.7543 61.0645L51.6709 60.4406Z" />
					<path d="M24.7527 60.4405C23.4853 62.0696 21.5994 63.1175 19.5138 63.3139C16.0397 63.642 12.9659 61.1679 12.3377 57.7607C12.2379 57.2179 12.2879 56.6617 12.482 56.1458C12.6761 55.6299 13.0071 55.1717 13.4409 54.8182C13.8747 54.4647 14.3972 54.2277 14.9555 54.1309C15.5137 54.0341 16.0891 54.0806 16.6242 54.266C17.1592 54.4515 17.6367 54.77 18.012 55.1921C18.3872 55.6142 18.6477 56.1261 18.7687 56.6793C18.8896 57.2325 18.867 57.8086 18.7031 58.3507C18.5393 58.8928 18.2397 59.3831 17.8311 59.7765C17.4225 60.1699 16.918 60.4541 16.3655 60.6023C15.813 60.7505 15.2306 60.7579 14.6743 60.6238L14.3376 61.5975C15.1061 61.7813 15.9117 61.7705 16.675 61.5662C17.4382 61.3618 18.1342 60.9713 18.6972 60.4317C19.2601 59.8921 19.6721 59.22 19.894 58.478C20.1159 57.7361 20.1401 56.9476 19.9647 56.1934C19.7893 55.4391 19.4201 54.7436 18.891 54.1713C18.362 53.599 17.6898 53.1686 16.9379 52.9214C16.186 52.6742 15.3798 52.6186 14.5976 52.7603C13.8154 52.902 13.0831 53.2362 12.4708 53.7319C11.8585 54.2276 11.3863 54.8697 11.0985 55.5981C10.8107 56.3266 10.717 57.1176 10.8261 57.8937C11.5793 61.9879 15.2531 64.9417 19.4472 64.5406C21.929 64.294 24.181 63.029 25.6692 61.0644L24.7527 60.4405Z" />
					<path d="M40 47.2264C37.8355 47.2264 35.7399 46.5138 34.0138 45.1884C32.2876 43.863 31.0182 42.0015 30.3866 39.8737C29.755 37.746 29.7947 35.4631 30.4997 33.3602C31.2048 31.2572 32.5393 29.4437 34.3164 28.1799C36.0935 26.916 38.2235 26.2683 40.3907 26.3279C42.5579 26.3876 44.6518 27.1514 46.3596 28.5115C48.0674 29.8716 49.3007 31.7567 49.8856 33.8935C50.4705 36.0303 50.3759 38.3081 49.615 40.3878L50.6149 40.7877C51.4648 38.4762 51.5704 35.9531 50.9177 33.579C50.2649 31.2049 48.885 29.097 46.9763 27.5676C45.0677 26.0381 42.7232 25.1638 40.2822 25.0733C37.8411 24.9828 35.4399 25.6809 33.4223 27.0708C31.4047 28.4606 29.8738 30.4713 29.0495 32.8095C28.2252 35.1476 28.1479 37.6958 28.8283 40.0789C29.5086 42.462 30.9125 44.5612 32.8372 46.0701C34.7619 47.5791 37.1075 48.4225 39.5325 48.4791V47.2528C39.6879 47.2436 39.8438 47.2368 40 47.2264Z" />
					<path d="M15.9259 33.0247C15.9248 33.0236 15.9259 33.0247 15.9281 33.0269C15.0915 32.3831 14.1349 31.9284 13.1182 31.6906C12.1014 31.4527 11.0459 31.4368 10.0226 31.6437C8.99926 31.8507 8.02908 32.2761 7.17432 32.893C6.31955 33.5098 5.59813 34.3048 5.05718 35.2268C4.51623 36.1488 4.16768 37.1775 4.03335 38.2478C3.89903 39.3181 3.98189 40.4067 4.27691 41.4424C4.57193 42.4781 5.07291 43.4385 5.74739 44.2627C6.42187 45.0869 7.25579 45.7567 8.19596 46.2286C8.63028 46.4421 9.07962 46.6224 9.54004 46.7679C11.7311 41.8845 15.6837 37.8918 20.5671 35.7009C19.9204 34.7809 18.5537 33.0247 15.9259 33.0247Z" />
					<path d="M59.6296 33.0247C59.6307 33.0236 59.6296 33.0247 59.6274 33.0269C60.464 32.3831 61.4206 31.9284 62.4373 31.6906C63.4541 31.4527 64.5096 31.4368 65.5329 31.6437C66.5562 31.8507 67.5264 32.2761 68.3812 32.893C69.2359 33.5098 69.9574 34.3048 70.4983 35.2268C71.0393 36.1488 71.3878 37.1775 71.5222 38.2478C71.6565 39.3181 71.5736 40.4067 71.2786 41.4424C70.9836 42.4781 70.4826 43.4385 69.8081 44.2627C69.1336 45.0869 68.2997 45.7567 67.3595 46.2286C66.9252 46.4421 66.4759 46.6224 66.0155 46.7679C63.8244 41.8845 59.8718 37.8918 54.9884 35.7009C55.6351 34.7809 57.0018 33.0247 59.6296 33.0247Z" />
					<path d="M40 38.7736C39.2583 38.7736 38.5333 38.9931 37.9166 39.4048C37.2999 39.8166 36.8193 40.4024 36.5355 41.0881C36.2516 41.7738 36.1773 42.5294 36.3221 43.2589C36.4669 43.9883 36.8244 44.6594 37.3483 45.1833C37.8722 45.7072 38.5433 46.0647 39.2728 46.2095C40.0023 46.3543 40.7578 46.28 41.4435 45.9961C42.1292 45.7123 42.715 45.2317 43.1268 44.615C43.5386 43.9983 43.758 43.2733 43.758 42.5316C43.758 41.5349 43.3622 40.5791 42.6517 39.8685C41.9411 39.158 40.9853 38.7622 39.9886 38.7622L40 38.7736Z" />
				</svg>
			),
		},
		{
			name: 'Java',
			icon: <RiJavaLine className="h-6 w-6 text-red-500 sm:h-12 sm:w-12" />,
		},
		{
			name: 'MySQL',
			icon: <SiMysql className="h-6 w-6 text-yellow-500 sm:h-12 sm:w-12" />,
		},
	];

	return (
		<div className="border-b">
			<section className="bg-accent/10 section-base relative">
				<div className="relative mx-auto max-w-xl p-2">
					{/* 九宫格 */}
					<div className="relative grid grid-cols-3 gap-0">
						{skills.map((skill, index, arr) => {
							const cols = 3;
							const total = arr.length;
							const lastRowStart = Math.floor((total - 1) / cols) * cols;
							const isLastRow = index >= lastRowStart;
							return (
								<div
									className={`hover:bg-accent/50 flex aspect-square flex-col
									items-center justify-center border-dashed border-gray-300
									transition-colors duration-300 dark:border-gray-800 ${
										index % cols !== cols - 1 ? 'border-r' : ''
									}
									${!isLastRow ? 'border-b' : ''} `}
									key={index}
								>
									{skill.icon}
									<span className="mt-1 text-sm">{skill.name}</span>
								</div>
							);
						})}
					</div>
				</div>
			</section>
		</div>
	);
}

export function AboutPage() {
	return (
		<>
			<PageTitle subtitle="About" title="关于" />

			<div className="border-b">
				<section className="section-base">
					<div className="flex flex-col gap-5 p-12">
						<TiltedCard
							containerHeight="100px"
							containerWidth="100px"
							imageHeight="100px"
							imageSrc="https://api.dicebear.com/7.x/adventurer/svg?seed=ichiyo"
							imageWidth="100px"
							rotateAmplitude={20}
							scaleOnHover={1.1}
							showMobileWarning={false}
							showTooltip={false}
						/>

						<div className="flex flex-col gap-2">
							<span>
								<h1 className="mr-2 inline-block text-4xl font-bold">ichiyo</h1>
								<h1 className="inline-block text-lg">
									取自罗马音一葉（Ichiyō）为名。
								</h1>
							</span>
						</div>
					</div>
				</section>
			</div>

			<div className="border-b">
				<section className="bg-diagonal-stripes-sm bg-background">
					<div className="py-2 text-center sm:py-4">
						<span
							className="text-accent-foreground px-4 py-1 text-lg font-medium
								sm:text-2xl"
						>
							技术栈
						</span>
					</div>
				</section>
			</div>

			<SkillStack />

			<div className="border-b">
				<section className="bg-diagonal-stripes-sm bg-background">
					<div className="py-2 text-center sm:py-4">
						<span
							className="text-accent-foreground px-4 py-1 text-lg font-medium
								sm:text-2xl"
						>
							项目展示
						</span>
					</div>
				</section>
			</div>

			<Project />

			<div className="border-b">
				<section className="bg-diagonal-stripes-sm bg-background">
					<div className="py-2 text-center sm:py-4">
						<span
							className="text-accent-foreground px-4 py-1 text-lg font-medium
								sm:text-2xl"
						>
							相册集
						</span>
					</div>
				</section>
			</div>

			<div className="border-b">
				<section className="section-base">
					<SlidesLoader />
				</section>
			</div>
		</>
	);
}
