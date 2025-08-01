# PNG Download Link

A React component for downloading HTML elements as PNG images.

## Installation

```bash
npm install png-download-link
```

## Usage

### Basic Usage (Download Only)

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

### Advanced Usage (Download + Share)

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
        {({ download, share }) => (
          <div>
            <button onClick={download}>📥 Download PNG</button>
            <button onClick={share}>🔗 Share PNG</button>
          </div>
        )}
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
| `children` | ReactNode \| Function | Yes | The trigger element(s) or render function for custom UI |
| `scale` | number | No | Canvas scale factor (default: 2) |
| `backgroundColor` | string | No | Background color (default: "#ffffff") |
| `width` | number | No | Explicit width for capture |
| `height` | number | No | Explicit height for capture |

## Features

- ✅ Convert any React component to PNG
- ✅ Download or share images
- ✅ Web Share API with clipboard fallback
- ✅ Render props pattern for custom UI
- ✅ TypeScript support
- ✅ Lightweight and easy to use

## Sharing Behavior

The share function uses the Web Share API when available (mobile devices, some desktop browsers), and falls back to copying the image to the clipboard on other devices.

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
