import SplitText from '@/components/ui/split-text';

interface PageTitleProps {
	title: string;
	subtitle?: string;
	className?: string;
}

export default function PageTitle({
	title,
	subtitle,
	className,
}: PageTitleProps) {
	const displayText = subtitle ? `${title} / ${subtitle}` : title;

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
