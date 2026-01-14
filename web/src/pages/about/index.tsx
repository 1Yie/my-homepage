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
	SiBun,
} from 'react-icons/si';

import Project from '@/components/about/project';
import PageTitle from '@/components/page-title';
import { Carousel } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import TiltedCard from '@/components/ui/tilted-card';
import { useGetSlides } from '@/hooks/use-get-slides';
import { useTitle } from '@/hooks/use-page-title';

function SlidesLoader() {
	const { slides, loading, error } = useGetSlides();

	if (loading) {
		return (
			<div
				className="relative flex h-full min-h-100 w-full items-center
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
				className="relative flex h-full min-h-100 w-full items-center
					justify-center overflow-hidden py-20"
			>
				<p className="text-red-500">错误: {error}</p>
			</div>
		);
	}

	if (slides.length === 0) {
		return (
			<div
				className="relative flex h-full min-h-100 w-full items-center
					justify-center overflow-hidden py-20"
			>
				<p className="text-muted-foreground">暂无图片</p>
			</div>
		);
	}

	return (
		<div
			className="relative flex h-full min-h-100 w-full items-center
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
			icon: <SiBun className="h-6 w-6 text-amber-200 sm:h-12 sm:w-12" />,
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
	useTitle('关于');
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
							imageSrc="https://dn-qiniu-avatar.qbox.me/avatar/d81d2d77f4683131d6bca4c3b5e5ab39?s=128&d=identicon"
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
							作品集
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

			<>
				<section className="section-base">
					<SlidesLoader />
				</section>
			</>
		</>
	);
}
