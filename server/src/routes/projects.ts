import { Elysia, t } from 'elysia';

import { authMiddleware } from '../lib/auth-middleware';
import { createProjectSchema, updateProjectSchema } from '../lib/schema';
import {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
} from '../services/projects';

export const projectsRoutes = new Elysia()
	.use(authMiddleware)
	.get('/projects', async () => {
		const projects = await getProjects();
		return { success: true, data: projects };
	})
	.get(
		'/projects/:id',
		async ({ params }) => {
			const project = await getProject(Number(params.id));
			if (!project) throw new Error('Project not found');
			return { success: true, data: project };
		},
		{
			params: t.Object({ id: t.String() }),
		}
	)
	.post(
		'/projects',
		async ({ body }) => {
			const project = await createProject(body);
			return { success: true, data: project };
		},
		{
			body: createProjectSchema,
			auth: true,
		}
	)
	.put(
		'/projects/:id',
		async ({ params, body }) => {
			const project = await updateProject(Number(params.id), body);
			return { success: true, data: project };
		},
		{
			params: t.Object({ id: t.String() }),
			body: updateProjectSchema,
			auth: true,
		}
	)
	.delete(
		'/projects/:id',
		async ({ params }) => {
			await deleteProject(Number(params.id));
			return { success: true };
		},
		{
			params: t.Object({ id: t.String() }),
			auth: true,
		}
	);
