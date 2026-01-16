import { useParams } from 'react-router-dom';

import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { SlideForm } from '@/components/slide-form';
import { Spinner } from '@/components/ui/spinner';
import { useGetSlide } from '@/hooks/slides/use-get-slide';
import { useTitle } from '@/hooks/use-page-meta';

export function EditSlidePage() {
	const { id } = useParams<{ id: string }>();
	const { slide, loading, error } = useGetSlide(id);

	useTitle(`编辑图片 ${slide?.title || ''}`);

	if (loading) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<div className="text-center">
						<Spinner className="mx-auto" size={32} />
					</div>
				</div>
			</div>
		);
	}

	if (error || !slide) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-muted-foreground">图片不存在</p>
				</div>
			</div>
		);
	}

	const initialFormData = {
		title: slide.title,
		src: slide.src,
		button: slide.button || '',
		link: slide.link || '',
		newTab: slide.newTab,
		order: slide.order,
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle subtitle="修改图片信息" title="编辑图片" />

			<SlideForm initialData={initialFormData} mode="edit" slideId={id} />
		</div>
	);
}
