import MDEditor from '@uiw/react-md-editor';
import { CornerDownLeft, LoaderCircle, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useBeforeUnload, useBlocker, useNavigate } from 'react-router-dom';

import { MarkdownRenderer } from '@/components/markdown-renderer';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useCreateArticle } from '@/hooks/article/use-create-article';
import { useUpdateArticle } from '@/hooks/article/use-update-article';
import { useGetTags } from '@/hooks/tags/use-get-tags';
import { useAiCompletion } from '@/hooks/use-ai-completion';
import { useGetAiConfig } from '@/hooks/use-ai-config';
import { generateSlug } from '@/lib/generate-slug';

interface ArticleFormData {
	title: string;
	slug: string;
	content: string;
	isDraft: boolean;
	tagIds: number[];
	tagNames: string[];
	headerImage: string;
}

interface ArticleFormProps {
	mode: 'create' | 'edit';
	articleId?: string;
	initialData?: Partial<ArticleFormData>;
}

function createInitialFormData(
	initialData?: Partial<ArticleFormData>
): ArticleFormData {
	return {
		title: initialData?.title || '',
		slug: initialData?.slug || '',
		content: initialData?.content || '',
		isDraft: initialData?.isDraft ?? true,
		tagIds: initialData?.tagIds || [],
		tagNames: [],
		headerImage: initialData?.headerImage || '',
	};
}

function serializeFormData(formData: ArticleFormData) {
	return JSON.stringify(formData);
}

export function ArticleForm({
	mode,
	articleId,
	initialData,
}: ArticleFormProps) {
	const navigate = useNavigate();
	const { tags: availableTags } = useGetTags(undefined, false);
	const { complete, completing } = useAiCompletion();
	const { config: aiConfig } = useGetAiConfig();
	const fimEnabled = aiConfig?.fimEnabled ?? true;
	const { createArticleAsync, loading: createLoading } = useCreateArticle();
	const { updateArticleAsync, loading: updateLoading } = useUpdateArticle();
	const loading = createLoading || updateLoading;
	const [newTagName, setNewTagName] = useState('');
	const [initialFormSnapshot, setInitialFormSnapshot] =
		useState<ArticleFormData>(() => createInitialFormData(initialData));
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState<ArticleFormData>(() =>
		createInitialFormData(initialData)
	);

	const [suggestion, setSuggestion] = useState<{
		mode: 'chat-prefix' | 'fim';
		source: 'idle' | 'manual';
		text: string;
		prefix: string;
		suffix: string;
	} | null>(null);
	const [suggestionPos, setSuggestionPos] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const [loadingPos, setLoadingPos] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const [completionError, setCompletionError] = useState<string | null>(null);
	const [fimHintVisible, setFimHintVisible] = useState(false);
	const [fimHintPos, setFimHintPos] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const [pendingCompletionMode, setPendingCompletionMode] = useState<
		'auto' | 'chat-prefix' | 'fim' | null
	>(null);
	const [noContentHintPos, setNoContentHintPos] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const idleFimTimerRef = useRef<number | null>(null);
	const noContentHintTimerRef = useRef<number | null>(null);
	const fimHintOverlayRef = useRef<HTMLDivElement>(null);
	const noContentHintOverlayRef = useRef<HTMLDivElement>(null);
	const editorRootRef = useRef<HTMLDivElement>(null);
	const suggestionOverlayRef = useRef<HTMLDivElement>(null);
	const loadingOverlayRef = useRef<HTMLDivElement>(null);
	const skipDismissRef = useRef(false);
	const isDirty =
		serializeFormData(formData) !== serializeFormData(initialFormSnapshot);
	const shouldBlockNavigation = isDirty && !isSubmitting;
	const blocker = useBlocker(shouldBlockNavigation);

	useBeforeUnload(
		useCallback(
			(event) => {
				if (!shouldBlockNavigation) return;

				event.preventDefault();
				event.returnValue = '';
			},
			[shouldBlockNavigation]
		),
		{ capture: true }
	);

	const handleStayOnPage = useCallback(() => {
		if (blocker.state === 'blocked') {
			blocker.reset();
		}
	}, [blocker]);

	const handleLeavePage = useCallback(() => {
		if (blocker.state === 'blocked') {
			blocker.proceed();
		}
	}, [blocker]);

	const getEditorElements = useCallback(() => {
		const root = editorRootRef.current;
		if (!root) {
			return {
				scrollArea: null,
				textarea: null,
			};
		}

		return {
			scrollArea: root.querySelector(
				'.w-md-editor-area'
			) as HTMLDivElement | null,
			textarea: root.querySelector(
				'.w-md-editor-text-input'
			) as HTMLTextAreaElement | null,
		};
	}, []);

	const getCursorPixelPos = useCallback((textarea: HTMLTextAreaElement) => {
		if (!textarea) return null;

		const cursorPos = textarea.selectionStart;
		const text = textarea.value;
		const computed = getComputedStyle(textarea);
		const textareaRect = textarea.getBoundingClientRect();

		// mirror 用 absolute 定位，脱离文档流，不影响布局
		const mirror = document.createElement('div');

		const mirrorStyles: Partial<CSSStyleDeclaration> = {
			position: 'absolute',
			visibility: 'hidden',
			pointerEvents: 'none',
			// 宽高与 textarea 完全一致
			width: `${textareaRect.width}px`,
			height: `${textareaRect.height}px`,
			// 关键：用 overflow:hidden + 手动同步 scrollTop 来模拟 textarea 的滚动
			overflow: 'hidden',
			whiteSpace: 'pre-wrap',
			wordWrap: 'break-word',
			overflowWrap: 'break-word',
			boxSizing: 'border-box',
			// 完整复制字体排版相关属性
			font: computed.font,
			fontSize: computed.fontSize,
			fontFamily: computed.fontFamily,
			fontWeight: computed.fontWeight,
			fontStyle: computed.fontStyle,
			lineHeight: computed.lineHeight,
			letterSpacing: computed.letterSpacing,
			wordSpacing: computed.wordSpacing,
			textTransform: computed.textTransform,
			paddingTop: computed.paddingTop,
			paddingRight: computed.paddingRight,
			paddingBottom: computed.paddingBottom,
			paddingLeft: computed.paddingLeft,
			borderTopWidth: computed.borderTopWidth,
			borderRightWidth: computed.borderRightWidth,
			borderBottomWidth: computed.borderBottomWidth,
			borderLeftWidth: computed.borderLeftWidth,
			borderStyle: 'solid',
			borderColor: 'transparent',
			tabSize: computed.tabSize,
		};

		Object.assign(mirror.style, mirrorStyles);

		// 定位到和 textarea 同一个父容器（相对定位祖先），避免 fixed 的坐标系问题
		document.body.appendChild(mirror);
		mirror.style.position = 'fixed';
		mirror.style.top = `${textareaRect.top}px`;
		mirror.style.left = `${textareaRect.left}px`;

		// 将光标之前的文字放进 mirror，光标处插入一个 span 作为测量锚点
		const beforeText = text.slice(0, cursorPos);
		const afterText = text.slice(cursorPos);

		const beforeNode = document.createTextNode(beforeText);
		const caretSpan = document.createElement('span');
		// 零宽字符，不影响排版，但能拿到精确的 BoundingClientRect
		caretSpan.textContent = '\u200B';
		const afterNode = document.createTextNode(afterText);

		mirror.appendChild(beforeNode);
		mirror.appendChild(caretSpan);
		mirror.appendChild(afterNode);

		// 同步 textarea 的 scrollTop，让 mirror 里的内容偏移量一致
		mirror.scrollTop = textarea.scrollTop;
		mirror.scrollLeft = textarea.scrollLeft;

		const spanRect = caretSpan.getBoundingClientRect();
		document.body.removeChild(mirror);

		// spanRect 如果在 textarea 可视区域外（被裁剪），spanRect 会是 0,0
		// 做一个合法性检查
		if (
			spanRect.width === 0 &&
			spanRect.height === 0 &&
			spanRect.top === 0 &&
			spanRect.left === 0
		) {
			return null;
		}

		return {
			top: spanRect.bottom + 4,
			left: spanRect.left,
		};
	}, []);

	const clampOverlayPosition = useCallback(
		(
			position: { top: number; left: number },
			overlay: HTMLDivElement | null,
			textarea: HTMLTextAreaElement
		) => {
			const margin = 12;
			const overlayRect = overlay?.getBoundingClientRect();
			const overlayWidth = overlayRect?.width ?? 320;
			const overlayHeight = overlayRect?.height ?? 44;
			const computed = getComputedStyle(textarea);
			const lineHeight =
				parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.4;

			const maxLeft = Math.max(
				margin,
				window.innerWidth - overlayWidth - margin
			);
			const clampedLeft = Math.min(Math.max(position.left, margin), maxLeft);

			const belowTop = position.top;
			const aboveTop = position.top - overlayHeight - lineHeight - 4;
			const fitsBelow = belowTop + overlayHeight <= window.innerHeight - margin;
			const fitsAbove = aboveTop >= margin;

			let top = belowTop;
			if (!fitsBelow && fitsAbove) {
				top = aboveTop;
			}

			const maxTop = Math.max(
				margin,
				window.innerHeight - overlayHeight - margin
			);
			const clampedTop = Math.min(Math.max(top, margin), maxTop);

			return {
				top: clampedTop,
				left: clampedLeft,
			};
		},
		[]
	);

	const updateOverlayPosition = useCallback(() => {
		if (!suggestion && !completing && !fimHintVisible && !noContentHintPos)
			return;

		const { textarea } = getEditorElements();
		if (!textarea) return;

		const basePos = getCursorPixelPos(textarea);
		if (!basePos) return;

		if (completing) {
			const nextPos = clampOverlayPosition(
				basePos,
				loadingOverlayRef.current,
				textarea
			);

			setLoadingPos((previous) => {
				if (
					previous &&
					previous.top === nextPos.top &&
					previous.left === nextPos.left
				) {
					return previous;
				}

				return nextPos;
			});
		}

		if (fimHintVisible) {
			const nextPos = clampOverlayPosition(
				basePos,
				fimHintOverlayRef.current,
				textarea
			);

			setFimHintPos((previous) => {
				if (
					previous &&
					previous.top === nextPos.top &&
					previous.left === nextPos.left
				) {
					return previous;
				}

				return nextPos;
			});
		}

		if (suggestion) {
			const nextPos = clampOverlayPosition(
				basePos,
				suggestionOverlayRef.current,
				textarea
			);

			setSuggestionPos((previous) => {
				if (
					previous &&
					previous.top === nextPos.top &&
					previous.left === nextPos.left
				) {
					return previous;
				}

				return nextPos;
			});
		}

		if (noContentHintPos) {
			const nextPos = clampOverlayPosition(
				basePos,
				noContentHintOverlayRef.current,
				textarea
			);

			setNoContentHintPos((previous) => {
				if (
					previous &&
					previous.top === nextPos.top &&
					previous.left === nextPos.left
				) {
					return previous;
				}

				return nextPos;
			});
		}
	}, [
		clampOverlayPosition,
		completing,
		fimHintVisible,
		getCursorPixelPos,
		getEditorElements,
		noContentHintPos,
		suggestion,
	]);

	const requestCompletion = useCallback(
		async (mode: 'auto' | 'chat-prefix' | 'fim', source: 'idle' | 'manual') => {
			const { textarea } = getEditorElements();
			if (!textarea) return;
			textarea.focus();

			const cursorPos = textarea.selectionStart;
			const prefix = formData.content.slice(0, cursorPos);
			const suffix = formData.content.slice(cursorPos);

			if (!prefix.trim()) return;

			setPendingCompletionMode(mode);
			const pos = getCursorPixelPos(textarea);
			setCompletionError(null);
			setSuggestion(null);
			setSuggestionPos(null);
			setNoContentHintPos(null);
			setLoadingPos(pos);

			try {
				const completion = await complete(prefix, formData.title, suffix, mode);
				setLoadingPos(null);
				setPendingCompletionMode(null);

				if (completion.text) {
					setSuggestion({
						mode: completion.mode,
						source,
						text: completion.text,
						prefix,
						suffix,
					});
					setSuggestionPos(pos);
				} else {
					setFimHintVisible(false);
					setFimHintPos(null);
					setNoContentHintPos(pos);
					if (noContentHintTimerRef.current) {
						window.clearTimeout(noContentHintTimerRef.current);
					}
					noContentHintTimerRef.current = window.setTimeout(() => {
						setNoContentHintPos(null);
						noContentHintTimerRef.current = null;
					}, 2000);
				}
			} catch (err) {
				setLoadingPos(null);
				setPendingCompletionMode(null);
				setCompletionError(err instanceof Error ? err.message : 'AI 补全失败');
			}
		},
		[
			complete,
			formData.content,
			formData.title,
			getCursorPixelPos,
			getEditorElements,
		]
	);

	const handleManualComplete = useCallback(() => {
		setFimHintVisible(false);
		setFimHintPos(null);
		void requestCompletion('auto', 'manual');
	}, [requestCompletion]);

	const triggerFimCompletion = useCallback(() => {
		setFimHintVisible(false);
		setFimHintPos(null);
		void requestCompletion('auto', 'idle');
	}, [requestCompletion]);

	const acceptSuggestion = useCallback(() => {
		if (!suggestion?.text) return;

		const { textarea } = getEditorElements();
		const cursorPos = textarea?.selectionStart ?? formData.content.length;
		skipDismissRef.current = true;

		setFormData((prev) => {
			const prefix = prev.content.slice(0, cursorPos);
			const suffix = prev.content.slice(cursorPos);

			return {
				...prev,
				content: prefix + suggestion.text + suffix,
			};
		});

		setSuggestion(null);
		setSuggestionPos(null);

		requestAnimationFrame(() => {
			const { textarea: nextTextarea } = getEditorElements();
			if (!nextTextarea) return;

			const nextCursorPos = cursorPos + suggestion.text.length;
			nextTextarea.focus();
			nextTextarea.setSelectionRange(nextCursorPos, nextCursorPos);
		});
	}, [formData.content.length, getEditorElements, suggestion]);

	const dismissSuggestion = useCallback(() => {
		setSuggestion(null);
		setSuggestionPos(null);
	}, []);

	const dismissFimHint = useCallback(() => {
		setFimHintVisible(false);
		setFimHintPos(null);
	}, []);

	useEffect(() => {
		const { textarea } = getEditorElements();
		if (!textarea) {
			return;
		}

		const resetFimHint = () => {
			requestAnimationFrame(() => {
				dismissFimHint();
			});
		};

		textarea.addEventListener('click', resetFimHint);
		textarea.addEventListener('focus', resetFimHint);
		textarea.addEventListener('keyup', resetFimHint);
		textarea.addEventListener('mouseup', resetFimHint);
		textarea.addEventListener('select', resetFimHint);

		return () => {
			textarea.removeEventListener('click', resetFimHint);
			textarea.removeEventListener('focus', resetFimHint);
			textarea.removeEventListener('keyup', resetFimHint);
			textarea.removeEventListener('mouseup', resetFimHint);
			textarea.removeEventListener('select', resetFimHint);
		};
	}, [dismissFimHint, getEditorElements]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.metaKey || e.ctrlKey) &&
				e.shiftKey &&
				(e.key === 'j' || e.key === 'J')
			) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				handleManualComplete();
				return;
			}
			if (fimHintVisible && e.key === 'Tab') {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				triggerFimCompletion();
				return;
			}
			if (
				suggestion &&
				suggestion.text &&
				suggestion.source === 'manual' &&
				e.key === 'Enter'
			) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				acceptSuggestion();
				return;
			}
			if (
				suggestion &&
				suggestion.text &&
				suggestion.source === 'idle' &&
				e.key === 'Tab'
			) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				acceptSuggestion();
				return;
			}
			if (suggestion && e.key === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				dismissSuggestion();
				return;
			}
		};

		document.addEventListener('keydown', handleKeyDown, true);
		return () => document.removeEventListener('keydown', handleKeyDown, true);
	}, [
		acceptSuggestion,
		dismissSuggestion,
		fimHintVisible,
		handleManualComplete,
		suggestion,
		triggerFimCompletion,
	]);

	useEffect(() => {
		if (idleFimTimerRef.current) {
			window.clearTimeout(idleFimTimerRef.current);
			idleFimTimerRef.current = null;
		}

		if (
			!fimEnabled ||
			completing ||
			Boolean(suggestion) ||
			Boolean(noContentHintPos)
		) {
			if (fimHintVisible) {
				requestAnimationFrame(() => {
					dismissFimHint();
				});
			}
			return;
		}

		idleFimTimerRef.current = window.setTimeout(() => {
			setFimHintVisible(true);
			requestAnimationFrame(() => {
				updateOverlayPosition();
			});
			idleFimTimerRef.current = null;
		}, 1000);

		return () => {
			if (idleFimTimerRef.current) {
				window.clearTimeout(idleFimTimerRef.current);
				idleFimTimerRef.current = null;
			}
		};
	}, [
		completing,
		dismissFimHint,
		fimEnabled,
		fimHintVisible,
		formData.content,
		noContentHintPos,
		suggestion,
		updateOverlayPosition,
	]);

	useEffect(() => {
		if (!suggestion && !completing && !fimHintVisible && !noContentHintPos) {
			return;
		}

		const initialFrame = requestAnimationFrame(() => {
			updateOverlayPosition();
		});

		const { scrollArea, textarea } = getEditorElements();
		if (!textarea) {
			return () => cancelAnimationFrame(initialFrame);
		}

		const scheduleUpdate = () => {
			requestAnimationFrame(() => {
				updateOverlayPosition();
			});
		};

		const handleSelectionChange = () => {
			if (document.activeElement === textarea) {
				scheduleUpdate();
			}
		};

		textarea.addEventListener('click', scheduleUpdate);
		textarea.addEventListener('focus', scheduleUpdate);
		textarea.addEventListener('keyup', scheduleUpdate);
		textarea.addEventListener('mouseup', scheduleUpdate);
		textarea.addEventListener('select', scheduleUpdate);
		scrollArea?.addEventListener('scroll', scheduleUpdate, { passive: true });
		document.addEventListener('scroll', scheduleUpdate, true);
		window.addEventListener('resize', scheduleUpdate);
		document.addEventListener('selectionchange', handleSelectionChange);

		return () => {
			cancelAnimationFrame(initialFrame);
			textarea.removeEventListener('click', scheduleUpdate);
			textarea.removeEventListener('focus', scheduleUpdate);
			textarea.removeEventListener('keyup', scheduleUpdate);
			textarea.removeEventListener('mouseup', scheduleUpdate);
			textarea.removeEventListener('select', scheduleUpdate);
			scrollArea?.removeEventListener('scroll', scheduleUpdate);
			document.removeEventListener('scroll', scheduleUpdate, true);
			window.removeEventListener('resize', scheduleUpdate);
			document.removeEventListener('selectionchange', handleSelectionChange);
		};
	}, [
		completing,
		fimHintVisible,
		getEditorElements,
		noContentHintPos,
		suggestion,
		updateOverlayPosition,
	]);

	useEffect(() => {
		if (!suggestion && !completing && !fimHintVisible && !noContentHintPos) {
			return;
		}

		const frame = requestAnimationFrame(() => {
			updateOverlayPosition();
		});

		return () => cancelAnimationFrame(frame);
	}, [
		completing,
		fimHintVisible,
		noContentHintPos,
		suggestion,
		updateOverlayPosition,
		suggestion?.text,
	]);

	useEffect(() => {
		return () => {
			if (noContentHintTimerRef.current) {
				window.clearTimeout(noContentHintTimerRef.current);
			}
		};
	}, []);

	const handleAddTag = async () => {
		if (!newTagName.trim()) return;

		const existingTag = availableTags.find(
			(tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
		);

		if (existingTag) {
			if (!formData.tagIds.includes(existingTag.id)) {
				setFormData({
					...formData,
					tagIds: [...formData.tagIds, existingTag.id],
				});
			}
		} else {
			if (!formData.tagNames.includes(newTagName.trim())) {
				setFormData({
					...formData,
					tagNames: [...formData.tagNames, newTagName.trim()],
				});
			}
		}

		setNewTagName('');
	};

	const handleRemoveTag = (tagId: number) => {
		setFormData({
			...formData,
			tagIds: formData.tagIds.filter((id) => id !== tagId),
		});
	};

	const handleRemoveNewTag = (tagName: string) => {
		setFormData({
			...formData,
			tagNames: formData.tagNames.filter((name) => name !== tagName),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (mode === 'create') {
				await createArticleAsync({
					title: formData.title,
					slug: formData.slug,
					content: formData.content,
					isDraft: formData.isDraft,
					tagIds: formData.tagIds,
					tagNames: formData.tagNames,
					headerImage: formData.headerImage,
				});
			} else if (mode === 'edit' && articleId) {
				await updateArticleAsync({
					id: articleId,
					title: formData.title,
					slug: formData.slug,
					content: formData.content,
					isDraft: formData.isDraft,
					tagIds: formData.tagIds,
					tagNames: formData.tagNames,
					headerImage: formData.headerImage,
				});
			}

			setInitialFormSnapshot({
				...formData,
				tagIds: [...formData.tagIds],
				tagNames: [...formData.tagNames],
			});
			navigate('/dashboard/articles');
		} catch (error) {
			setIsSubmitting(false);
			console.error(`Failed to ${mode} article:`, error);
		}
	};

	return (
		<Card className="max-w-7xl">
			<CardContent>
				<AlertDialog
					onOpenChange={(open) => {
						if (!open) {
							handleStayOnPage();
						}
					}}
					open={blocker.state === 'blocked'}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>离开当前编辑页面？</AlertDialogTitle>
							<AlertDialogDescription>
								你有尚未保存的文章内容。继续离开将丢失本次修改。
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<Button onClick={handleStayOnPage} variant="outline">
								继续编辑
							</Button>
							<Button onClick={handleLeavePage} variant="destructive">
								确认离开
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="grid gap-2">
						<Label htmlFor="title">标题</Label>
						<Input
							id="title"
							onChange={(e) => {
								const newTitle = e.target.value;
								setFormData({
									...formData,
									title: newTitle,
									slug: generateSlug(newTitle),
								});
							}}
							placeholder="输入文章标题"
							required
							value={formData.title}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="slug">Slug</Label>
						<Input
							id="slug"
							onChange={(e) =>
								setFormData({ ...formData, slug: e.target.value })
							}
							placeholder="自动生成的 slug"
							required
							value={formData.slug}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="headerImage">头图链接</Label>
						<Input
							id="headerImage"
							onChange={(e) =>
								setFormData({ ...formData, headerImage: e.target.value })
							}
							placeholder="输入头图图片链接 (可选)"
							value={formData.headerImage}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="status">状态</Label>
						<Select
							modal={false}
							onValueChange={(value) =>
								setFormData({ ...formData, isDraft: value === '草稿' })
							}
							value={formData.isDraft ? '草稿' : '已发布'}
						>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="草稿">草稿</SelectItem>
								<SelectItem value="已发布">已发布</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<Label>标签</Label>
						<div className="space-y-3">
							<div className="relative">
								<Input
									onChange={(e) => setNewTagName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											const matchingTags = availableTags.filter(
												(tag) =>
													tag.name
														.toLowerCase()
														.includes(newTagName.toLowerCase()) &&
													!formData.tagIds.includes(tag.id)
											);
											if (matchingTags.length > 0) {
												setFormData({
													...formData,
													tagIds: [...formData.tagIds, matchingTags[0].id],
												});
												setNewTagName('');
											} else if (newTagName.trim()) {
												handleAddTag();
											}
										}
									}}
									placeholder="输入或选择标签"
									value={newTagName}
								/>
								{newTagName && (
									<div
										className="absolute top-full left-0 right-0 bg-background
											border rounded-md shadow-md z-10 max-h-40 overflow-y-auto"
									>
										{availableTags
											.filter(
												(tag) =>
													tag.name
														.toLowerCase()
														.includes(newTagName.toLowerCase()) &&
													!formData.tagIds.includes(tag.id)
											)
											.map((tag) => (
												<button
													className="w-full text-left px-3 py-2 hover:bg-muted"
													key={tag.id}
													onClick={() => {
														setFormData({
															...formData,
															tagIds: [...formData.tagIds, tag.id],
														});
														setNewTagName('');
													}}
													type="button"
												>
													{tag.name}
												</button>
											))}
										{!availableTags.some((tag) =>
											tag.name.toLowerCase().includes(newTagName.toLowerCase())
										) &&
											newTagName.trim() && (
												<button
													className="w-full text-left px-3 py-2 hover:bg-muted
														text-muted-foreground"
													onClick={() => {
														handleAddTag();
													}}
													type="button"
												>
													创建 "{newTagName}"，回车以确认
												</button>
											)}
									</div>
								)}
							</div>

							{/* Selected tags display */}
							{formData.tagIds.length > 0 || formData.tagNames.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{/* Existing tags */}
									{formData.tagIds.map((tagId) => {
										const tag = availableTags.find((t) => t.id === tagId);
										return tag ? (
											<div
												className="inline-flex items-center gap-1 px-2 py-1
													bg-secondary text-secondary-foreground rounded-md
													text-sm"
												key={`existing-${tag.id}`}
											>
												{tag.name}
												<button
													className="ml-1 text-secondary-foreground/70
														hover:text-secondary-foreground"
													onClick={() => handleRemoveTag(tag.id)}
													type="button"
												>
													×
												</button>
											</div>
										) : null;
									})}
									{/* New tags (not yet created) */}
									{formData.tagNames.map((tagName) => (
										<div
											className="inline-flex items-center gap-1 px-2 py-1
												bg-blue-100 text-blue-800 rounded-md text-sm border
												border-blue-300 dark:bg-blue-900 dark:text-blue-100
												dark:border-blue-700"
											key={`new-${tagName}`}
										>
											{tagName}

											<button
												className="ml-1 text-blue-800/70 hover:text-blue-800
													dark:text-blue-100/70 dark:hover:text-blue-100"
												onClick={() => handleRemoveNewTag(tagName)}
												type="button"
											>
												×
											</button>
										</div>
									))}
								</div>
							) : (
								<div className="text-sm text-muted-foreground">
									暂无标签，请在上方输入并添加
								</div>
							)}
						</div>
					</div>

					{/* Content Editor and Preview */}
					<div className="grid gap-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="content">内容</Label>
							<div className="flex items-center gap-2">
								<Button
									disabled={completing || !formData.content.trim()}
									onClick={handleManualComplete}
									size="sm"
									type="button"
									variant="outline"
								>
									<Sparkles className="mr-1 h-4 w-4" />
									{completing
										? pendingCompletionMode === 'fim'
											? 'FIM 生成中...'
											: '续写生成中...'
										: 'AI 续写'}
									<Kbd>Ctrl</Kbd>
									<Kbd>Shift</Kbd>
									<Kbd>J</Kbd>
								</Button>
							</div>
						</div>
						{completionError && (
							<div
								className="rounded-md border border-destructive/30
									bg-destructive/10 px-3 py-2 text-sm text-destructive"
							>
								{completionError}
							</div>
						)}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{/* Editor */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-muted-foreground">
									Markdown 编辑器
								</Label>
								<div ref={editorRootRef}>
									<MDEditor
										height="auto"
										minHeight={300}
										onChange={(value) => {
											setFormData({ ...formData, content: value || '' });
											requestAnimationFrame(() => {
												dismissFimHint();
											});
											if (skipDismissRef.current) {
												skipDismissRef.current = false;
												return;
											}
											dismissSuggestion();
										}}
										preview="edit"
										value={formData.content}
									/>
									{completing && loadingPos && (
										<div
											className="pointer-events-none fixed z-50 flex
												items-center gap-2 rounded-full border bg-card/95 px-3
												py-1.5 text-xs text-muted-foreground shadow-lg
												backdrop-blur"
											ref={loadingOverlayRef}
											style={{
												top: loadingPos.top,
												left: loadingPos.left,
											}}
										>
											<LoaderCircle
												className="h-3.5 w-3.5 animate-spin text-primary"
											/>
											<span>AI 补全中...</span>
										</div>
									)}
									{fimHintVisible &&
										fimHintPos &&
										!suggestion &&
										!completing &&
										!noContentHintPos && (
											<div
												className="pointer-events-none fixed z-50 flex
													items-center gap-2 rounded-full border bg-card/95 px-3
													py-1.5 text-xs text-muted-foreground shadow-lg
													backdrop-blur"
												ref={fimHintOverlayRef}
												style={{
													top: fimHintPos.top,
													left: fimHintPos.left,
												}}
											>
												<Sparkles className="h-3.5 w-3.5 text-primary" />
												<span>按</span>
												<Kbd>Tab</Kbd>
												<span>触发 FIM 补全</span>
											</div>
										)}
									{suggestion && suggestionPos && (
										<div
											className="fixed z-50 max-w-lg rounded-lg border bg-card
												shadow-lg"
											ref={suggestionOverlayRef}
											style={{
												top: suggestionPos.top,
												left: suggestionPos.left,
											}}
										>
											<div
												className="flex items-start gap-2 border-b px-3 py-2
													text-xs text-muted-foreground"
											>
												<Sparkles className="mt-0.5 h-3 w-3 text-primary" />
												<span>
													{suggestion.mode === 'fim'
														? 'FIM 建议'
														: 'AI 续写建议'}
												</span>
												<button
													className="ml-auto rounded-sm p-0.5 hover:bg-muted"
													onClick={dismissSuggestion}
													type="button"
												>
													<X className="h-3 w-3" />
												</button>
											</div>
											<div
												className="max-h-48 overflow-y-auto px-3 py-2 font-mono
													text-sm whitespace-pre-wrap"
											>
												{suggestion.text}
											</div>
											<div className="border-t px-3 py-2">
												<Button
													className="w-full"
													onClick={acceptSuggestion}
													size="sm"
												>
													<CornerDownLeft className="mr-1 h-3 w-3" />
													{suggestion.mode === 'fim' ? '接受 FIM' : '接受续写'}
													<Kbd>
														{suggestion.source === 'idle' ? 'Tab' : 'Enter'}
													</Kbd>
												</Button>
											</div>
										</div>
									)}
									{noContentHintPos && (
										<div
											className="pointer-events-none fixed z-50 flex
												items-center gap-2 rounded-full border bg-card/95 px-3
												py-1.5 text-xs text-muted-foreground shadow-lg
												backdrop-blur"
											ref={noContentHintOverlayRef}
											style={{
												top: noContentHintPos.top,
												left: noContentHintPos.left,
											}}
										>
											<span>暂无内容</span>
										</div>
									)}
								</div>
							</div>

							{/* Preview */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-muted-foreground">
									实时预览
								</Label>
								<div
									className="border rounded-md py-1 px-2 bg-muted/20
										overflow-y-auto h-auto"
								>
									<MarkdownRenderer>{formData.content}</MarkdownRenderer>
								</div>
							</div>
						</div>
					</div>

					<div className="flex gap-4">
						<Button disabled={loading} type="submit">
							{loading
								? mode === 'create'
									? '创建中...'
									: '保存中...'
								: mode === 'create'
									? '创建文章'
									: '保存更改'}
						</Button>
						<Button
							onClick={() => navigate('/dashboard/articles')}
							type="button"
							variant="outline"
						>
							取消
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
