import { db } from '../lib/db';

export interface Slide {
	id: number;
	title: string;
	src: string;
	button?: string | null;
	link?: string | null;
	newTab: boolean;
	order: number;
}

interface CreateSlideInput {
	title: string;
	src: string;
	button?: string;
	link?: string;
	newTab?: boolean;
	order?: number;
}

interface UpdateSlideInput {
	title?: string;
	src?: string;
	button?: string | null;
	link?: string | null;
	newTab?: boolean;
	order?: number;
}

export async function getSlides(): Promise<Slide[]> {
	const slides = await db.slide.findMany({
		orderBy: { order: 'asc' },
	});

	return slides.map((s) => ({
		...s,
		button: s.button || null,
		link: s.link || null,
	}));
}

export async function getSlide(id: number): Promise<Slide | null> {
	const slide = await db.slide.findUnique({
		where: { id },
	});

	if (!slide) return null;

	return {
		...slide,
		button: slide.button || null,
		link: slide.link || null,
	};
}

export async function createSlide(data: CreateSlideInput): Promise<Slide> {
	const slide = await db.slide.create({
		data: {
			title: data.title,
			src: data.src,
			button: data.button,
			link: data.link,
			newTab: data.newTab ?? false,
			order: data.order ?? 0,
		},
	});

	return {
		...slide,
		button: slide.button || null,
		link: slide.link || null,
	};
}

export async function updateSlide(
	id: number,
	data: UpdateSlideInput
): Promise<Slide> {
	const updateData: Record<string, unknown> = {};

	if (data.title !== undefined) updateData.title = data.title;
	if (data.src !== undefined) updateData.src = data.src;
	if (data.button !== undefined) updateData.button = data.button;
	if (data.link !== undefined) updateData.link = data.link;
	if (data.newTab !== undefined) updateData.newTab = data.newTab;
	if (data.order !== undefined) updateData.order = data.order;

	const slide = await db.slide.update({
		where: { id },
		data: updateData,
	});

	return {
		...slide,
		button: slide.button || null,
		link: slide.link || null,
	};
}

export async function deleteSlide(id: number): Promise<void> {
	await db.slide.delete({
		where: { id },
	});
}
