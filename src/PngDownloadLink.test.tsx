import React from 'react';
import { render } from '@testing-library/react';
import { PNGDownloadLink } from './PngDownloadLink';


jest.mock('html2canvas', () => jest.fn(() =>
  Promise.resolve({
    toDataURL: jest.fn(() => 'data:image/png;base64,mockImageData')
  })
));

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
    unmount: jest.fn()
  }))
}));

describe('PNGDownloadLink', () => {
  const mockDocument = <div>Test Content</div>;

  it('renders without crashing', () => {
    const { container } = render(
      <PNGDownloadLink document={mockDocument}>
        <button>Download PNG</button>
      </PNGDownloadLink>
    );

    expect(container).toBeDefined();
  });

  it('accepts all props without errors', () => {
    const { container } = render(
      <PNGDownloadLink
        document={mockDocument}
        fileName="test.png"
        scale={2}
        backgroundColor="#ffffff"
        width={800}
        height={600}
      >
        <div>Download</div>
      </PNGDownloadLink>
    );

    expect(container).toBeDefined();
  });

  it('handles different types of children', () => {
    const buttonComponent = render(
      <PNGDownloadLink document={mockDocument}>
        <button>Button Child</button>
      </PNGDownloadLink>
    );

    const divComponent = render(
      <PNGDownloadLink document={mockDocument}>
        <div>Div Child</div>
      </PNGDownloadLink>
    );

    const textComponent = render(
      <PNGDownloadLink document={mockDocument}>
        Plain text child
      </PNGDownloadLink>
    );

    expect(buttonComponent.container).toBeDefined();
    expect(divComponent.container).toBeDefined();
    expect(textComponent.container).toBeDefined();
  });

  it('component exports correctly', () => {
    expect(PNGDownloadLink).toBeDefined();
    expect(typeof PNGDownloadLink).toBe('function');
  });
});
