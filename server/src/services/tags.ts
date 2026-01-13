import { db } from '../lib/db';

export interface Tag {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TagWithCount extends Tag {
	articleCount: number;
}

export interface CreateTagInput {
	name: string;
}

export interface UpdateTagInput {
	name: string;
}

// 获取所有标签
export async function getTags(): Promise<Tag[]> {
	return await db.tag.findMany({
		orderBy: {
			name: 'asc',
		},
	});
}

// 获取所有标签（带文章数量）
export async function getTagsWithCount(): Promise<TagWithCount[]> {
	const tags = await db.tag.findMany({
		include: {
			_count: {
				select: {
					articles: true,
				},
			},
		},
		orderBy: {
			name: 'asc',
		},
	});

	return tags.map((tag) => ({
		id: tag.id,
		name: tag.name,
		createdAt: tag.createdAt,
		updatedAt: tag.updatedAt,
		articleCount: tag._count.articles,
	}));
}

// 根据 ID 获取单个标签
export async function getTagById(id: number): Promise<TagWithCount | null> {
	const tag = await db.tag.findUnique({
		where: { id },
		include: {
			_count: {
				select: {
					articles: true,
				},
			},
		},
	});

	if (!tag) return null;

	return {
		id: tag.id,
		name: tag.name,
		createdAt: tag.createdAt,
		updatedAt: tag.updatedAt,
		articleCount: tag._count.articles,
	};
}

// 根据名称获取标签
export async function getTagByName(name: string): Promise<Tag | null> {
	return await db.tag.findUnique({
		where: { name },
	});
}

// 创建标签
export async function createTag(data: CreateTagInput): Promise<Tag> {
	// 检查标签是否已存在
	const existing = await getTagByName(data.name);
	if (existing) {
		throw new Error(`Tag with name "${data.name}" already exists`);
	}

	return await db.tag.create({
		data: {
			name: data.name.trim(),
		},
	});
}

// 更新标签
export async function updateTag(
	id: number,
	data: UpdateTagInput
): Promise<Tag> {
	// 检查标签是否存在
	const tag = await getTagById(id);
	if (!tag) {
		throw new Error('Tag not found');
	}

	// 如果名称有变化，检查新名称是否已被使用
	if (data.name !== tag.name) {
		const existing = await getTagByName(data.name);
		if (existing && existing.id !== id) {
			throw new Error(`Tag with name "${data.name}" already exists`);
		}
	}

	return await db.tag.update({
		where: { id },
		data: {
			name: data.name.trim(),
		},
	});
}

// 删除标签
export async function deleteTag(id: number): Promise<void> {
	// 检查标签是否存在
	const tag = await getTagById(id);
	if (!tag) {
		throw new Error('Tag not found');
	}

	// 检查是否有文章使用该标签
	if (tag.articleCount > 0) {
		throw new Error(
			`Cannot delete tag "${tag.name}" because it is used by ${tag.articleCount} article(s)`
		);
	}

	// 删除标签
	await db.tag.delete({
		where: { id },
	});
}

// 批量删除标签
export async function deleteTagsBatch(ids: number[]): Promise<{
	deleted: number[];
	failed: Array<{ id: number; reason: string }>;
}> {
	const deleted: number[] = [];
	const failed: Array<{ id: number; reason: string }> = [];

	for (const id of ids) {
		try {
			await deleteTag(id);
			deleted.push(id);
		} catch (error) {
			failed.push({
				id,
				reason: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	}

	return { deleted, failed };
}
