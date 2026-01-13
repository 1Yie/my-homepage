import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '@/api/client';
import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { SlideForm } from '@/components/slide-form';

interface ApiResponse<T> {
	success: boolean;
	data: T;
}

interface SlideApiData {
	id: number;
	title: string;
	src: string;
	button: string | null;
	link: string | null;
	newTab: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
}

export function EditSlidePage() {
	const { id } = useParams<{ id: string }>();
	const [fetchLoading, setFetchLoading] = useState(true);
	const [initialFormData, setInitialFormData] = useState<{
		title: string;
		src: string;
		button: string;
		link: string;
		newTab: boolean;
		order: number;
	} | null>(null);

	useEffect(() => {
		const fetchSlide = async () => {
			if (!id) return;

			try {
				setFetchLoading(true);
				const response = await client.slides({ id }).get();
				const apiResponse = response.data as ApiResponse<SlideApiData>;
				if (apiResponse.success && apiResponse.data) {
					const slideData = apiResponse.data;
					setInitialFormData({
						title: slideData.title,
						src: slideData.src,
						button: slideData.button || '',
						link: slideData.link || '',
						newTab: slideData.newTab,
						order: slideData.order,
					});
				}
			} catch (error) {
				console.error('Failed to fetch slide:', error);
			} finally {
				setFetchLoading(false);
			}
		};

		fetchSlide();
	}, [id]);

	if (fetchLoading) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-muted-foreground">加载中...</p>
				</div>
			</div>
		);
	}

	if (!initialFormData) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-muted-foreground">图片不存在</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle subtitle="修改图片信息" title="编辑图片" />

			<SlideForm initialData={initialFormData} mode="edit" slideId={id} />
		</div>
	);
}
