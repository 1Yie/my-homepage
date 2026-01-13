import { CalendarDays, Edit } from 'lucide-react';

import SplitText from '@/components/ui/split-text';

interface PageTitleProps {
	title: string;
	subtitle?: string;
	className?: string;
	type?: 'blog' | 'default';
	backgroundImage?: string;
	createdAt?: Date | string;
	updatedAt?: Date | string;
	tags?: { id: number; name: string }[];
}

export default function PageTitle({
	title,
	subtitle,
	className,
	type = 'default',
	backgroundImage,
	createdAt,
	updatedAt,
	tags,
}: PageTitleProps) {
	const displayText = subtitle ? `${title} / ${subtitle}` : title;

	const formatDateTime = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // getMonth() returns 0-11
		const day = date.getDate();
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${year}/${month}/${day} ${hours}:${minutes}`;
	};

	let displayCreatedAt: string | null = null;
	let displayUpdatedAt: string | null = null;

	if (createdAt) {
		const created = new Date(createdAt);
		displayCreatedAt = formatDateTime(created);
	}

	if (updatedAt) {
		const updated = new Date(updatedAt);
		displayUpdatedAt = formatDateTime(updated);
	}

	if (displayCreatedAt && displayUpdatedAt) {
		const created = new Date(createdAt!);
		const updated = new Date(updatedAt!);
		const sameDay = created.toDateString() === updated.toDateString();
		const timeDiff =
			Math.abs(updated.getTime() - created.getTime()) < 30 * 60 * 1000; // 30 minutes
		if (sameDay && timeDiff) {
			displayUpdatedAt = null; // 只显示创建时间
		}
	}

	if (type === 'blog') {
		return (
			<div className="border-b">
				<section
					className={`section-base
						${backgroundImage ? 'w-full h-[60vh]' : 'min-h-[30vh] sm:min-h-[40vh]'}
						${backgroundImage ? '' : 'bg-squares'} flex flex-col items-start
						justify-center overflow-visible ${className || ''}`}
					style={
						backgroundImage
							? {
									backgroundImage: `url(${backgroundImage})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat',
								}
							: undefined
					}
				>
					{backgroundImage && (
						<div className="absolute inset-0 bg-black/15"></div>
					)}
					<div className="p-4 relative">
						<SplitText
							className={`text-4xl sm:text-6xl
								${backgroundImage ? 'text-white' : 'text-foreground'}`}
							delay={45}
							duration={0.4}
							ease="power3.out"
							from={{ opacity: 0, y: -40 }}
							splitType="chars"
							text={displayText}
							textAlign="left"
							threshold={0.1}
							to={{ opacity: 1, y: 0 }}
						/>
						<div
							className={`mt-2 flex items-center gap-4 ${
								backgroundImage
									? 'text-gray-200 text-xl sm:text-2xl'
									: 'text-foreground text-xl sm:text-2xl'
								}`}
						>
							{displayCreatedAt && (
								<div className="flex items-center gap-1">
									<CalendarDays className="w-4 h-4" />
									<span>{displayCreatedAt}</span>
								</div>
							)}
							{displayUpdatedAt && (
								<div className="flex items-center gap-1">
									<Edit className="w-4 h-4" />
									<span>{displayUpdatedAt}</span>
								</div>
							)}
						</div>
						{tags && tags.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-2">
								{tags.map((tag) => (
									<span
										className={`inline-flex items-center px-3 py-1 rounded-full
										text-sm font-medium transition-colors backdrop-blur-sm ${
											backgroundImage
												? `bg-white/10 text-white border border-white/20
													hover:bg-white/20`
												: `bg-primary/10 text-primary border border-primary/20
													hover:bg-primary/20`
										}`}
										key={tag.id}
									>
										#{tag.name}
									</span>
								))}
							</div>
						)}
					</div>
				</section>
			</div>
		);
	}

	// Default type
	return (
		<div className="border-b">
			<section
				className={`section-base bg-squares flex min-h-[15vh] flex-col
					items-start justify-center overflow-visible sm:min-h-[20vh]
					${className || ''}`}
			>
				<div className="p-4">
					<SplitText
						className="text-2xl sm:text-4xl"
						delay={45}
						duration={0.4}
						ease="power3.out"
						from={{ opacity: 0, y: -40 }}
						splitType="chars"
						text={displayText}
						textAlign="left"
						threshold={0.1}
						to={{ opacity: 1, y: 0 }}
					/>
				</div>
			</section>
		</div>
	);
}
