import React, {useCallback, cloneElement, isValidElement} from 'react';
import html2canvas from 'html2canvas';
import {createRoot} from 'react-dom/client';

export type ImageFormat = 'png' | 'jpeg' | 'jpg' | 'webp';

interface Actions {
	download: () => Promise<void>;
	share: () => Promise<void>;
}

interface ImageDownloadLinkProps {
	children: React.ReactNode | ((actions: Actions) => React.ReactNode);
	document: React.ReactNode;
	fileName?: string;
	quality?: number;
	scale?: number;
	backgroundColor?: string;
	width?: number;
	height?: number;
}

export const ImageDownloadLink = ({
	children,
	document,
	fileName,
	quality = 0.92,
	scale = 2,
	backgroundColor = '#ffffff',
	width,
	height,
}: ImageDownloadLinkProps) => {
	const getFormatFromExtension = (fileName: string): ImageFormat => {
		const extension = fileName.split('.').pop()?.toLowerCase();
		switch (extension) {
			case 'jpg':
			case 'jpeg':
				return 'jpeg';
			case 'png':
				return 'png';
			case 'webp':
				return 'webp';
			default:
				throw new Error(
					`Unsupported file extension: ${extension}. Supported: .png, .jpg, .jpeg, .webp`
				);
		}
	};

	const finalFileName = fileName || 'image.png';
	const format = getFormatFromExtension(finalFileName);
	const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
	const captureImage = useCallback(async () => {
		const container = window.document.createElement('div');
		container.style.position = 'absolute';
		container.style.left = '-9999px';
		container.style.top = '-9999px';

		if (width) {
			container.style.width = `${width}px`;
		} else {
			container.style.width = 'auto';
		}

		if (height) {
			container.style.height = `${height}px`;
		} else {
			container.style.height = 'auto';
		}

		container.style.pointerEvents = 'none';
		container.style.overflow = 'visible';

		window.document.body.appendChild(container);

		try {
			const root = createRoot(container);

			await new Promise<void>((resolve) => {
				root.render(document as React.ReactElement);
				setTimeout(resolve, 100);
			});

			const images = container.querySelectorAll('img');
			await Promise.all(
				Array.from(images).map(
					(img) =>
						new Promise<void>((resolve) => {
							if (img.complete) resolve();
							else {
								img.onload = () => resolve();
								img.onerror = () => resolve();
							}
						})
				)
			);

			await new Promise((resolve) => setTimeout(resolve, 200));

			const canvas = await html2canvas(container, {
				scale,
				backgroundColor: backgroundColor.startsWith('#') ? backgroundColor : undefined,
				useCORS: true,
				allowTaint: true,
				width: width || container.scrollWidth,
				height: height || container.scrollHeight,
			});

			const supportsQuality = format !== 'png';
			const dataUrl = canvas.toDataURL(mimeType, supportsQuality ? quality : undefined);
			const blob = await new Promise<Blob>((resolve) => {
				canvas.toBlob((blob) => resolve(blob!), mimeType, supportsQuality ? quality : undefined);
			});

			root.unmount();

			if (container.parentNode) {
				window.document.body.removeChild(container);
			}

			return {dataUrl, blob, canvas};
		} catch (error) {
			if (container.parentNode) {
				window.document.body.removeChild(container);
			}
			throw error;
		}
	}, [document, backgroundColor, scale, width, height, mimeType, format, quality]);

	const download = useCallback(async () => {
		const {dataUrl} = await captureImage();
		const linkElement = window.document.createElement('a');
		linkElement.href = dataUrl;
		linkElement.download = finalFileName;
		linkElement.click();
	}, [captureImage, finalFileName]);

	const share = useCallback(async () => {
		const {blob} = await captureImage();
		const file = new File([blob], finalFileName, {type: mimeType});

		if (navigator.share && navigator.canShare && navigator.canShare({files: [file]})) {
			try {
				await navigator.share({
					files: [file],
				});
			} catch (error) {
				console.error('[ImageDownloadLink] Share failed:', error);
				await copyToClipboard(blob);
			}
		} else {
			await copyToClipboard(blob);
		}
	}, [captureImage, finalFileName, mimeType]);

	const copyToClipboard = async (blob: Blob) => {
		if (navigator.clipboard && window.ClipboardItem) {
			try {
				await navigator.clipboard.write([new ClipboardItem({[mimeType]: blob})]);
			} catch (error) {}
		} else {
		}
	};

	const actions: Actions = {download, share};

	if (typeof children === 'function') {
		return <>{children(actions)}</>;
	}

	const enhancedChildren = isValidElement(children)
		? cloneElement(children as React.ReactElement<any>, {onClick: download})
		: children;

	return <>{enhancedChildren}</>;
};

export const PNGDownloadLink = ImageDownloadLink;
export default ImageDownloadLink;
