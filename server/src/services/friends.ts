import { db } from '../lib/db';

export interface SocialLink {
	id: number;
	name: string;
	link: string;
	iconLight: string;
	iconDark: string;
}

export interface Friend {
	id: number;
	name: string;
	image: string;
	description: string;
	pinned: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
	socialLinks: SocialLink[];
}

export interface CreateFriendInput {
	name: string;
	image: string;
	description: string;
	pinned?: boolean;
	order?: number;
	socialLinks: Array<{
		name: string;
		link: string;
		iconLight: string;
		iconDark: string;
	}>;
}

export interface UpdateFriendInput {
	name?: string;
	image?: string;
	description?: string;
	pinned?: boolean;
	order?: number;
	socialLinks?: Array<{
		id?: number;
		name: string;
		link: string;
		iconLight: string;
		iconDark: string;
	}>;
}

// 获取所有友链
export async function getFriends(): Promise<Friend[]> {
	return await db.friend.findMany({
		include: {
			socialLinks: true,
		},
		orderBy: [{ pinned: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
	});
}

// 根据 ID 获取单个友链
export async function getFriendById(id: number): Promise<Friend | null> {
	return await db.friend.findUnique({
		where: { id },
		include: {
			socialLinks: true,
		},
	});
}

// 创建友链
export async function createFriend(data: CreateFriendInput): Promise<Friend> {
	return await db.friend.create({
		data: {
			name: data.name,
			image: data.image,
			description: data.description,
			pinned: data.pinned ?? false,
			order: data.order ?? 0,
			socialLinks: {
				create: data.socialLinks,
			},
		},
		include: {
			socialLinks: true,
		},
	});
}

// 更新友链
export async function updateFriend(
	id: number,
	data: UpdateFriendInput
): Promise<Friend> {
	// 检查友链是否存在
	const friend = await getFriendById(id);
	if (!friend) {
		throw new Error('Friend not found');
	}

	// 如果提供了 socialLinks，先删除旧的，再创建新的
	if (data.socialLinks) {
		await db.socialLink.deleteMany({
			where: { friendId: id },
		});
	}

	return await db.friend.update({
		where: { id },
		data: {
			name: data.name,
			image: data.image,
			description: data.description,
			pinned: data.pinned,
			order: data.order,
			...(data.socialLinks && {
				socialLinks: {
					create: data.socialLinks.map(
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						({ id: _id, ...link }) => link
					) as Array<{
						name: string;
						link: string;
						iconLight: string;
						iconDark: string;
					}>,
				},
			}),
		},
		include: {
			socialLinks: true,
		},
	});
}

// 删除友链
export async function deleteFriend(id: number): Promise<void> {
	// 检查友链是否存在
	const friend = await getFriendById(id);
	if (!friend) {
		throw new Error('Friend not found');
	}

	// 删除友链（Cascade 会自动删除关联的 socialLinks）
	await db.friend.delete({
		where: { id },
	});
}
