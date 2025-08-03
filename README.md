# React Element Capture

A React component for capturing and downloading HTML elements as images in multiple formats (PNG, JPEG, WebP).

## Installation

```bash
npm install @temilayodev/react-element-capture
```

```bash
yarn add @temilayodev/react-element-capture
```

## Usage

### Basic Usage (PNG Download)

```jsx
import React from 'react';
import { PNGDownloadLink } from '@temilayodev/react-element-capture';

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

### Multiple Format Support

```jsx
import React from 'react';
import { ImageDownloadLink } from '@temilayodev/react-element-capture';

function App() {
  const contentToDownload = (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h1>Download in any format</h1>
      <p>Some content here...</p>
    </div>
  );

  return (
    <div>
      {/* PNG (default) */}
      <ImageDownloadLink document={contentToDownload}>
        <button>Download PNG</button>
      </ImageDownloadLink>

      {/* JPEG with quality control */}
      <ImageDownloadLink 
        document={contentToDownload}
        quality={0.8}
        fileName="my-image.jpg"
      >
        <button>Download JPEG</button>
      </ImageDownloadLink>

      {/* WebP format */}
      <ImageDownloadLink 
        document={contentToDownload}
        quality={0.9}
        fileName="my-image.webp"
      >
        <button>Download WebP</button>
      </ImageDownloadLink>
    </div>
  );
}
```

### Advanced Usage (Download + Share)

```jsx
import React from 'react';
import { ImageDownloadLink } from '@temilayodev/react-element-capture';

function App() {
  const contentToDownload = (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h1>This will be downloaded as image</h1>
      <p>Some content here...</p>
    </div>
  );

  return (
    <div>
      <ImageDownloadLink 
        document={contentToDownload}
        quality={0.9}
        fileName="my-image.jpg"
      >
        {({ download, share }) => (
          <div>
            <button onClick={download}>📥 Download JPEG</button>
            <button onClick={share}>🔗 Share JPEG</button>
          </div>
        )}
      </ImageDownloadLink>
    </div>
  );
}
```

## Components

### `ImageDownloadLink` (Recommended)
The main component with full format support (.png, .jpg, .jpeg, .webp).

### `PNGDownloadLink`
Alias for `ImageDownloadLink` - supports all the same formats and features. Named for backward compatibility but works identically to `ImageDownloadLink`.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `document` | ReactNode | Yes | The React element/component to capture as image |
| `fileName` | string | No | Name of the downloaded file **with extension** (default: 'image.png'). Format is derived from extension. |
| `quality` | number | No | Image quality for lossy formats (0-1, default: 0.92, ignored for PNG) |
| `children` | ReactNode \| Function | Yes | The trigger element(s) or render function for custom UI |
| `scale` | number | No | Canvas scale factor (default: 2) |
| `backgroundColor` | string | No | Background color (default: "#ffffff") |
| `width` | number | No | Explicit width for capture |
| `height` | number | No | Explicit height for capture |

## Important: fileName Requirements

**The `fileName` prop must include a file extension** (`.png`, `.jpg`, `.jpeg`, or `.webp`). The image format is automatically determined from the file extension.

**Examples:**
- ✅ `fileName="my-image.png"` → PNG format
- ✅ `fileName="photo.jpg"` → JPEG format  
- ✅ `fileName="picture.webp"` → WebP format
- ❌ `fileName="my-image"` → Error: missing extension

**Supported extensions:**
- `.png` → PNG format
- `.jpg`, `.jpeg` → JPEG format
- `.webp` → WebP format

## Features

- ✅ Convert any React component to images in multiple formats (PNG, JPEG, WebP)
- ✅ Quality control for lossy formats (JPEG, WebP)
- ✅ Download or share images
- ✅ Web Share API with clipboard fallback
- ✅ Render props pattern for custom UI
- ✅ TypeScript support with full type definitions
- ✅ Lightweight and easy to use

## Sharing Behavior

The share function uses the Web Share API when available (mobile devices, some desktop browsers), and falls back to copying the image to the clipboard on other devices.

## Development

```bash
# Install dependencies
npm install
# or
yarn install

# Build the project
npm run build
# or
yarn build

# Run tests
npm test
# or
yarn test
```

## License

MIT © Temilayo

## Keywords

- React
- PNG
- JPEG
- WebP
- Download
- HTML2Canvas
- Export
- Image Generation
