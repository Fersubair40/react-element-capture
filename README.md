# PNG Download Link

A React component for downloading HTML elements as PNG images.

## Installation

```bash
npm install png-download-link
```

## Usage

```jsx
import React from 'react';
import { PNGDownloadLink } from 'png-download-link';

function App() {
  const contentToDownload = (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h1>This will be downloaded as PNG</h1>
      <p>Some content here...</p>
    </div>
  );

  return (
    <div>
      <PNGDownloadLink 
        document={contentToDownload}
        fileName="my-image.png"
      >
        <button>Download as PNG</button>
      </PNGDownloadLink>
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `document` | ReactNode | Yes | The React element/component to capture as PNG |
| `fileName` | string | No | Name of the downloaded file (default: "receipt.png") |
| `children` | ReactNode | Yes | The trigger element (button, link, etc.) |
| `scale` | number | No | Canvas scale factor (default: 2) |
| `backgroundColor` | string | No | Background color (default: "#ffffff") |
| `width` | number | No | Explicit width for capture |
| `height` | number | No | Explicit height for capture |

## Features

- ✅ Convert any HTML element to PNG
- ✅ Customizable filename
- ✅ TypeScript support
- ✅ Lightweight and easy to use

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Version management (using semantic-release)
npm run release
```

## License

MIT © Temilayo

## Keywords

- React
- PNG
- Download
- HTML2Canvas
- Export
- Image Generation
