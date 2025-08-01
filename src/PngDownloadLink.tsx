import React, {useCallback, cloneElement, isValidElement} from 'react';
import html2canvas from 'html2canvas';
import {createRoot} from 'react-dom/client';

interface PngDownloadLinkProps {
	children: React.ReactNode;
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
	const downloadPNG = useCallback(async () => {
		// Create a temporary container with explicit dimensions
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

			// Additional wait to ensure all styles are applied
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
			const linkElement = window.document.createElement('a');
			linkElement.href = dataUrl;
			linkElement.download = fileName;
			linkElement.click();


			root.unmount();
		} finally {
		
			if (container.parentNode) {
				window.document.body.removeChild(container);
			}
		}
	}, [document, backgroundColor, fileName, scale]);

	const enhancedChildren = isValidElement(children)
		? cloneElement(children as React.ReactElement<any>, {onClick: downloadPNG})
		: children;

	return <>{enhancedChildren}</>;
};

export default PNGDownloadLink;
