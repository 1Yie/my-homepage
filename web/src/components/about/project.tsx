import { ExternalLink, Github } from 'lucide-react';

import { useGetProjects, type Project } from '@/hooks/use-get-projects';

function ProjectCard({ project }: { project: Project }) {
	return (
		<div
			className="group relative flex flex-col overflow-hidden border bg-card
				transition-all duration-300"
		>
			{/* 项目图片 */}
			{project.imageUrl && (
				<div className="aspect-video w-full overflow-hidden bg-muted">
					<img
						alt={project.name}
						className="h-full w-full object-cover"
						src={project.imageUrl}
					/>
				</div>
			)}

			{/* 项目信息 */}
			<div className="flex flex-1 flex-col p-6">
				<h3 className="mb-2 text-xl font-bold">{project.name}</h3>
				<p className="mb-4 text-sm text-muted-foreground">
					{project.description}
				</p>

				{/* 标签 */}
				<div className="mb-4 flex flex-wrap gap-2">
					{project.tags.map((tag) => (
						<span
							className="rounded-full bg-primary/10 px-3 py-1 text-xs
								text-primary"
							key={tag}
						>
							{tag}
						</span>
					))}
				</div>

				{/* 链接 */}
				<div className="mt-auto flex gap-3">
					{project.githubUrl && (
						<a
							className="flex items-center gap-1 text-sm text-muted-foreground
								transition-colors hover:text-primary"
							href={project.githubUrl}
							rel="noopener noreferrer"
							target="_blank"
						>
							<Github className="h-4 w-4" />
							<span>源码</span>
						</a>
					)}
					{project.liveUrl && (
						<a
							className="flex items-center gap-1 text-sm text-muted-foreground
								transition-colors hover:text-primary"
							href={project.liveUrl}
							rel="noopener noreferrer"
							target="_blank"
						>
							<ExternalLink className="h-4 w-4" />
							<span>预览</span>
						</a>
					)}
				</div>
			</div>
		</div>
	);
}

export default function Project() {
	const { projects, loading, error } = useGetProjects();

	if (loading) {
		return (
			<div className="border-b">
				<section className="section-base">
					<div className="mx-auto max-w-6xl p-6 sm:p-12">
						<div className="flex items-center justify-center py-16">
							<div
								className="h-8 w-8 animate-spin rounded-full border-4
									border-primary border-t-transparent"
							/>
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
