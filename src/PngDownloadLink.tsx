import React, {useCallback, cloneElement, isValidElement} from 'react';
import html2canvas from 'html2canvas';
import {createRoot} from 'react-dom/client';

interface Actions {
	download: () => Promise<void>;
	share: () => Promise<void>;
}

interface PngDownloadLinkProps {
	children: React.ReactNode | ((actions: Actions) => React.ReactNode);
	document: React.ReactNode;
	fileName?: string;
	scale?: number;
	backgroundColor?: string;
	width?: number;
	height?: number;
}

export const PNGDownloadLink = ({
	children,
	document,
	fileName = 'receipt.png',
	scale = 2,
	backgroundColor = '#ffffff',
	width,
	height,
}: PngDownloadLinkProps) => {
	const captureImage = useCallback(async () => {
		const container = window.document.createElement('div');
		container.style.position = 'absolute';
		container.style.left = '-9999px';
		container.style.top = '-9999px';

		// Set explicit dimensions if provided
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

			const dataUrl = canvas.toDataURL('image/png');
			const blob = await new Promise<Blob>((resolve) => {
				canvas.toBlob((blob) => resolve(blob!), 'image/png');
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
	}, [document, backgroundColor, scale, width, height]);

	const download = useCallback(async () => {
		const {dataUrl} = await captureImage();
		const linkElement = window.document.createElement('a');
		linkElement.href = dataUrl;
		linkElement.download = fileName;
		linkElement.click();
	}, [captureImage, fileName]);

	const share = useCallback(async () => {
		const {blob} = await captureImage();
		const file = new File([blob], fileName, {type: 'image/png'});

		if (navigator.share && navigator.canShare && navigator.canShare({files: [file]})) {
			try {
				await navigator.share({files: [file]});
			} catch (error) {
				await copyToClipboard(blob);
			}
		} else {
			await copyToClipboard(blob);
		}
	}, [captureImage, fileName]);

	const copyToClipboard = async (blob: Blob) => {
		if (navigator.clipboard && window.ClipboardItem) {
			try {
				await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
			} catch (error) {
				console.warn('Failed to copy image to clipboard:', error);
			}
		} else {
			console.warn('Clipboard API not supported');
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

export default PNGDownloadLink;
