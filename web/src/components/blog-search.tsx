import { Search, X } from 'lucide-react';
import { useState, Suspense, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import type { Article } from '@/hooks/article/use-get-articles';

import { client } from '@/api/client';
import { Skeleton } from '@/components/ui/skeleton';
import { debouncePromise } from '@/lib/debounce';
import { cn } from '@/lib/utils';

function fetchSearchResults(query: string): Promise<Article[]> {
	if (!query.trim()) return Promise.resolve([]);
	return client.api.v1.articles
		.get({ query: { public: 'true', q: query } })
		.then((r) => {
			const data = r.data?.data;
			if (!data) return [];
			if (Array.isArray(data)) {
				return data;
			}
			return data.articles || [];
		});
}

const debouncedFetchSearchResults = debouncePromise(fetchSearchResults, 500);

function SearchResults({
	searchPromise,
}: {
	searchPromise: Promise<Article[]>;
}) {
	const navigate = useNavigate();
	const searchResults = use(searchPromise);

	if (searchResults.length === 0) {
		return (
			<div className="py-4 text-center">
				<p className="text-muted-foreground text-sm">暂无搜索结果</p>
			</div>
		);
	}

	return (
		<ul className="divide-y">
			{searchResults.map((post) => (
				<li className="hover:bg-muted/50 transition-colors" key={post.id}>
					<Link className="block p-2 sm:p-3" to={`/blog/${post.slug}`}>
						<h3
							className="text-foreground line-clamp-2 text-sm font-medium
								sm:text-base"
						>
							{post.title}
						</h3>

						<div className="my-1 flex flex-wrap gap-1">
							{post.tags.slice(0, 5).map((tag) => (
								<span
									className="bg-accent text-accent-foreground rounded-full
										px-1.5 py-0.5 text-xs"
									key={tag.id}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										navigate(`/tags/${encodeURIComponent(tag.name)}`);
									}}
								>
									#{tag.name}
								</span>
							))}
							{post.tags.length > 5 && (
								<span className="text-muted-foreground text-xs">
									+{post.tags.length - 5}个标签
								</span>
							)}
						</div>
						<p className="text-muted-foreground mt-1 text-xs">
							{new Date(post.createdAt).toLocaleDateString()}
						</p>
					</Link>
				</li>
			))}
		</ul>
	);
}

interface BlogSearchProps {
	value?: string;
	onChange?: (value: string) => void;
}

export default function BlogSearch({ value, onChange }: BlogSearchProps = {}) {
	const [internalSearchQuery, setInternalSearchQuery] = useState('');
	const [searchPromise, setSearchPromise] = useState<Promise<Article[]>>(
		Promise.resolve([])
	);
	const [showResults, setShowResults] = useState(false);

	const searchQuery = value ?? internalSearchQuery;
	const handleSearchChange = onChange ?? setInternalSearchQuery;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		handleSearchChange(newValue);
		setShowResults(newValue.trim().length > 0);

		if (newValue.trim()) {
			setSearchPromise(debouncedFetchSearchResults(newValue));
		} else {
			setSearchPromise(Promise.resolve([]));
		}
	};

	const clearSearch = () => {
		handleSearchChange('');
		setShowResults(false);
		setSearchPromise(Promise.resolve([]));
	};

	return (
		<div className="relative w-full">
			<div className="relative">
				<div
					className="bg-background hover:border-foreground/50
						focus-within:border-foreground/50 flex items-center overflow-hidden
						rounded-lg border transition-all duration-300"
				>
					<div className="pl-2 sm:pl-3">
						<Search className="text-muted-foreground" size={18} />
					</div>
					<input
						className="placeholder:text-muted-foreground w-full bg-transparent
							px-2 py-2 text-sm outline-none placeholder:text-sm sm:py-2
							sm:text-base"
						onChange={handleChange}
						placeholder="搜索文章 标题 / 内容 / 标签"
						type="text"
						value={searchQuery}
					/>
					<div
						className={cn(
							'flex items-center overflow-hidden transition-all duration-300',
							searchQuery ? 'w-10' : 'w-0'
						)}
					>
						<button
							className="text-muted-foreground hover:text-foreground
								cursor-pointer"
							onClick={clearSearch}
						>
							<X size={18} />
						</button>
					</div>
				</div>
			</div>

			{showResults && searchQuery && (
				<div
					className="bg-background absolute top-full right-0 left-0 z-50 mt-1
						max-h-75 overflow-hidden rounded-lg border shadow-lg"
				>
					<div className="max-h-75 overflow-y-auto">
						<Suspense
							fallback={
								<div className="space-y-3 p-3">
									<Skeleton className="h-5 w-3/4 sm:h-6" />
									<Skeleton className="h-5 w-1/2 sm:h-6" />
									<Skeleton className="h-5 w-2/3 sm:h-6" />
								</div>
							}
						>
							<SearchResults searchPromise={searchPromise} />
						</Suspense>
					</div>
				</div>
			)}
		</div>
	);
}
