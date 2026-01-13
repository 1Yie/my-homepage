import { db } from '../lib/db';

export interface Project {
	id: number;
	name: string;
	description: string;
	tags: string[];
	githubUrl?: string | null;
	liveUrl?: string | null;
	imageUrl?: string | null;
	order: number;
}

interface CreateProjectInput {
	name: string;
	description: string;
	tags: string[];
	githubUrl?: string;
	liveUrl?: string;
	imageUrl?: string;
	order?: number;
}

interface UpdateProjectInput {
	name?: string;
	description?: string;
	tags?: string[];
	githubUrl?: string | null;
	liveUrl?: string | null;
	imageUrl?: string | null;
	order?: number;
}

export async function getProjects(): Promise<Project[]> {
	const projects = await db.project.findMany({
		orderBy: { order: 'asc' },
	});

	return projects.map((p) => ({
		...p,
		tags: JSON.parse(p.tags) as string[],
		githubUrl: p.githubUrl || null,
		liveUrl: p.liveUrl || null,
		imageUrl: p.imageUrl || null,
	}));
}

export async function getProject(id: number): Promise<Project | null> {
	const project = await db.project.findUnique({
		where: { id },
	});

	if (!project) return null;

	return {
		...project,
		tags: JSON.parse(project.tags) as string[],
		githubUrl: project.githubUrl || null,
		liveUrl: project.liveUrl || null,
		imageUrl: project.imageUrl || null,
	};
}

export async function createProject(
	data: CreateProjectInput
): Promise<Project> {
	const project = await db.project.create({
		data: {
			name: data.name,
			description: data.description,
			tags: JSON.stringify(data.tags),
			githubUrl: data.githubUrl,
			liveUrl: data.liveUrl,
			imageUrl: data.imageUrl,
			order: data.order ?? 0,
		},
	});

	return {
		...project,
		tags: JSON.parse(project.tags) as string[],
		githubUrl: project.githubUrl || null,
		liveUrl: project.liveUrl || null,
		imageUrl: project.imageUrl || null,
	};
}

export async function updateProject(
	id: number,
	data: UpdateProjectInput
): Promise<Project> {
	const updateData: Record<string, unknown> = {};

	if (data.name !== undefined) updateData.name = data.name;
	if (data.description !== undefined) updateData.description = data.description;
	if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
	if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl;
	if (data.liveUrl !== undefined) updateData.liveUrl = data.liveUrl;
	if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
	if (data.order !== undefined) updateData.order = data.order;

	const project = await db.project.update({
		where: { id },
		data: updateData,
	});

	return {
		...project,
		tags: JSON.parse(project.tags) as string[],
		githubUrl: project.githubUrl || null,
		liveUrl: project.liveUrl || null,
		imageUrl: project.imageUrl || null,
	};
}

export async function deleteProject(id: number): Promise<void> {
	await db.project.delete({
		where: { id },
	});
}
