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

export const projectsRoutes = new Elysia({ prefix: '/projects' })
	.use(authMiddleware)
	.get(
		'/',
		async () => {
			const projects = await getProjects();
			return { success: true, data: projects };
		},
		{
			detail: {
				description: '获取所有项目列表',
				tags: ['项目'],
			},
		}
	)
	.get(
		'/:id',
		async ({ params }) => {
			const project = await getProject(Number(params.id));
			if (!project) throw new Error('Project not found');
			return { success: true, data: project };
		},
		{
			params: t.Object({ id: t.String({ description: '项目ID' }) }),
			detail: {
				description: '根据ID获取单个项目信息',
				tags: ['项目'],
			},
		}
	)
	.post(
		'/',
		async ({ body }) => {
			const project = await createProject(body);
			return { success: true, data: project };
		},
		{
			body: createProjectSchema,
			auth: true,
			security: [{ BearerAuth: [] }],
			detail: {
				description: '创建新项目（需要用户认证）',
				tags: ['项目'],
			},
		}
	)
	.put(
		'/:id',
		async ({ params, body }) => {
			const project = await updateProject(Number(params.id), body);
			return { success: true, data: project };
		},
		{
			params: t.Object({ id: t.String({ description: '项目ID' }) }),
			body: updateProjectSchema,
			auth: true,
			detail: {
				description: '更新指定ID的项目信息（需要用户认证）',
				tags: ['项目'],
			},
		}
	)
	.delete(
		'/:id',
		async ({ params }) => {
			await deleteProject(Number(params.id));
			return { success: true };
		},
		{
			params: t.Object({ id: t.String({ description: '项目ID' }) }),
			auth: true,
			detail: {
				description: '删除指定ID的项目（需要用户认证）',
				tags: ['项目'],
			},
		}
	);
