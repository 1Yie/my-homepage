import { Tags, Rss, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';

import BlogSearch from '@/components/blog-search';

interface BlogPanelProps {
	onSearchChange?: (value: string) => void;
	searchValue?: string;
	className?: string;
}

export default function BlogPanel({
	onSearchChange,
	searchValue,
	className,
}: BlogPanelProps) {
	return (
		<div className={`border-b ${className || ''}`}>
			<section
				className="section-base bg-diagonal-stripes-sm flex flex-col gap-3 px-4
					py-3 sm:flex-row sm:justify-between sm:gap-0 sm:py-1.5"
			>
				<div className="flex items-center justify-between sm:justify-start">
					<div className="flex items-center gap-4">
						<Link
							className="hover:text-foreground/60 flex items-center gap-1
								text-base transition-colors"
							to="/tags"
						>
							<Tags size={19} />
							标签
						</Link>
						<a
							className="hover:text-foreground/60 flex items-center gap-1
								text-base transition-colors"
							href="/api/rss"
							target="_blank"
						>
							<Rss size={17} />
							订阅
						</a>
						<Link
							className="hover:text-foreground/60 flex items-center gap-1
								text-base transition-colors"
							to="/archive"
						>
							<Archive size={17} />
							归档
						</Link>
					</div>
				</div>
				<div className="w-full sm:w-auto sm:max-w-xs">
					<BlogSearch onChange={onSearchChange} value={searchValue} />
				</div>
			</section>
		</div>
	);
}
