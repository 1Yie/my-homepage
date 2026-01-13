import { Link } from 'react-router-dom';

import FadeContent from '@/components/ui/fade-content';
import SplitText from '@/components/ui/split-text';
import { useTitle } from '@/hooks/use-page-title';

export function NotFoundPage() {
	useTitle('404 Not Found', { hasSuffix: false });
	return (
		<div className="border-b">
			<section
				className="section-base bg-squares flex h-[50vh] flex-col items-center
					justify-center sm:h-[65vh]"
			>
				<div className="flex-initial flex-col p-6 text-center">
					<SplitText
						className="mb-4 text-3xl sm:text-5xl"
						delay={60}
						duration={0.4}
						ease="power3.out"
						from={{ opacity: 0, y: -40 }}
						splitType="chars"
						text={'页面未找到'}
						threshold={0.1}
						to={{ opacity: 1, y: 0 }}
					/>

					<FadeContent blur={true} duration={420} initialOpacity={0}>
						<p
							className="mb-4 text-sm text-gray-700 sm:text-lg
								dark:text-gray-300"
						>
							您访问的页面不存在
						</p>
						<Link
							className="text-sm text-gray-800 hover:underline sm:text-lg
								dark:text-gray-300"
							to="/"
						>
							返回首页
						</Link>
					</FadeContent>
				</div>
			</section>
		</div>
	);
}
