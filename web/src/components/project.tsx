import { ExternalLink, Github } from 'lucide-react';

import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
	useGetProjects,
	type Project,
} from '@/hooks/projects/use-get-projects';

function ProjectCard({ project }: { project: Project }) {
	return (
		<CardContainer className="inter-var">
			<CardBody className="relative group/card">
				{/* 项目图片 */}
				<CardItem className="w-full px-2" translateZ="60">
					<div className="absolute inset-0 dark:bg-black/30"></div>
					{project.imageUrl && (
						<img
							alt={project.name}
							className="h-40 w-full object-cover group-hover/card:shadow-md"
							src={project.imageUrl}
						/>
					)}
				</CardItem>

				{/* 项目标题 */}
				<CardItem
					className="mt-4 **:text-xl font-bold text-neutral-600
						dark:text-neutral-200"
					translateZ="80"
				>
					{project.name}
				</CardItem>

				{/* 项目描述 */}
				<CardItem
					as="p"
					className="text-neutral-500 text-sm max-w-sm mt-2
						dark:text-neutral-300"
					translateZ="90"
				>
					{project.description}
				</CardItem>

				{/* 标签 */}
				<CardItem className="w-full mt-4" translateZ="60">
					<div className="flex flex-wrap gap-2">
						{project.tags.map((tag) => (
							<span
								className="rounded-full bg-primary/10 px-3 py-1 text-xs
									text-primary dark:text-primary/80 dark:bg-primary/20"
								key={tag}
							>
								{tag}
							</span>
						))}
					</div>
				</CardItem>

				{/* 链接按钮 */}
				<div className="flex justify-end items-center mt-4">
					{project.githubUrl && (
						<CardItem translateZ={20}>
							<button
								className="flex gap-1 item-center cursor-pointer px-2 py-1
									rounded-xl text-xs font-normal dark:text-neutral-300
									hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => {
									if (project.githubUrl) {
										window.open(
											project.githubUrl,
											'_blank',
											'noopener,noreferrer'
										);
									}
								}}
							>
								<Github className="h-4 w-4" />
								<span>源码</span>
							</button>
						</CardItem>
					)}
					{project.liveUrl && (
						<CardItem translateZ={20}>
							<button
								className="flex gap-1 item-center cursor-pointer px-2 py-1
									rounded-xl text-xs font-normal dark:text-neutral-300
									hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
								onClick={() => {
									if (project.liveUrl) {
										window.open(
											project.liveUrl,
											'_blank',
											'noopener,noreferrer'
										);
									}
								}}
							>
								<ExternalLink className="h-4 w-4" />
								<span>预览</span>
							</button>
						</CardItem>
					)}
				</div>
			</CardBody>
		</CardContainer>
	);
}

export default function Project() {
	const { projects, loading, error } = useGetProjects();

	if (loading) {
		return (
			<div className="border-b">
				<section className="section-base">
					<div className="mx-auto max-w-6xl p-6 sm:p-12">
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<CardContainer className="inter-var" key={i}>
									<CardBody
										className="bg-gray-50 relative group/card dark:bg-black
											dark:border-white/20 border-black/10 w-auto sm:w-full
											h-auto rounded-xl p-6 border"
									>
										<Skeleton className="h-6 w-3/4 mb-2" />
										<Skeleton className="h-4 w-full mb-4" />
										<Skeleton className="aspect-video w-full rounded-xl mb-4" />
										<div className="flex flex-wrap gap-2 mb-4">
											{Array.from({ length: 3 }).map((_, j) => (
												<Skeleton className="h-6 w-12 rounded-full" key={j} />
											))}
										</div>
										<div className="flex justify-between items-center mt-8">
											<Skeleton className="h-8 w-20 rounded-xl" />
											<Skeleton className="h-8 w-20 rounded-xl" />
										</div>
									</CardBody>
								</CardContainer>
							))}
						</div>
					</div>
				</section>
			</div>
		);
	}

	if (error) {
		return (
			<div className="border-b">
				<section className="section-base">
					<div className="mx-auto max-w-6xl p-6 sm:p-12">
						<div className="flex items-center justify-center py-8">
							<p className="text-red-500">错误: {error}</p>
						</div>
					</div>
				</section>
			</div>
		);
	}

	return (
		<div className="border-b">
			<section className="section-base">
				<div className="mx-auto max-w-6xl p-6 sm:p-12">
					{projects.length === 0 ? (
						<div className="flex items-center justify-center py-8">
							<p className="text-muted-foreground">暂无项目</p>
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{projects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
