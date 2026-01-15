import { useState } from 'react';

import AnimatedContent from '@/components/ui/animated-content';
import { ContainerTextFlip } from '@/components/ui/container-text-flip';
import SplitText from '@/components/ui/split-text';
import { useSeo } from '@/hooks/use-page-meta';
import { cn } from '@/lib/utils';

const words = ['边缘', 'AI 重度依赖', '数字游民', '咖啡迷'];

export function HomePage() {
	useSeo({
		title: 'ichiyo (@1Yie)',
		hasSuffix: false,
		description: '存活于二十一世纪互联网 の 边缘 / ichiyo (@1Yie)',
		keywords: ['ichiyo', '一叶'],
	});
	const [fadeTrigger, setFadeTrigger] = useState(false);

	const textFlipClasses = cn(
		'inline-flex items-center justify-center m-0 leading-none text-primary whitespace-nowrap',
		'text-3xl sm:text-5xl font-bold',
		'tracking-[0.1em] sm:tracking-[0.2em] -mr-[0.1em] sm:-mr-[0.2em]',
		'gap-2 sm:gap-6',
		"before:content-['「'] before:text-[1.1em] before:font-black before:opacity-50",
		"after:content-['」'] after:text-[1.1em] after:font-black after:opacity-50"
	);

	return (
		<>
			<section
				className="section-base bg-squares h-[60vh] p-3 sm:h-[80vh]
					overflow-hidden"
			>
				<div
					className="font-yu-pixel flex min-h-full flex-col items-center
						justify-center text-center font-bold"
				>
					<SplitText
						className="text-3xl tracking-tight sm:text-5xl"
						delay={40}
						duration={0.6}
						ease="power3.out"
						from={{ opacity: 0, y: -40 }}
						onLetterAnimationComplete={() => setFadeTrigger(true)}
						rootMargin="-100px"
						splitType="chars"
						text="存活于二十一世纪互联网"
						textAlign="center"
						threshold={0.1}
						to={{ opacity: 1, y: 0 }}
					/>
					<AnimatedContent
						direction="vertical"
						distance={50}
						duration={0.5}
						ease="power2.out"
						initialOpacity={0}
						reverse={false}
						trigger={fadeTrigger}
					>
						<p
							className="font-pixel m-2 text-2xl text-gray-400 sm:m-5
								sm:text-4xl"
						>
							の
						</p>
					</AnimatedContent>

					<AnimatedContent
						delay={0.2}
						direction="vertical"
						distance={50}
						duration={0.5}
						ease="power2.out"
						initialOpacity={0}
						reverse={false}
						trigger={fadeTrigger}
					>
						<ContainerTextFlip
							className="h-[5.5vh] max-w-full flex items-center justify-center"
							interval={4000}
							textClassName={textFlipClasses}
							words={words}
						/>
					</AnimatedContent>
				</div>
			</section>
		</>
	);
}
