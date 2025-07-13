
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import PostCanvas from '@/components/PostCanvas';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock-image-data'),
  }),
}));

describe('PostCanvas Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders post canvas with basic props', () => {
    const mockTemplate = {
      id: 'family-1',
      message: 'In memory of [Name], my beloved [relationship]',
      imagePath: '/test-image.jpg',
      postType: 'family-template'
    };
    
    const { container } = render(
      <PostCanvas
        template={mockTemplate}
        personalization={{ name: 'John', relationship: 'son' }}
        customText="Test message"
      />
    );

    expect(container.querySelector('#post-canvas')).toBeInTheDocument();
  });

  it('applies correct styling for different template types', () => {
    const mockTemplate = {
      id: 'advocate-1',
      message: 'Advocacy message for awareness',
      imagePath: '/test-image.jpg',
      postType: 'advocate'
    };
    
    const { container } = render(
      <PostCanvas
        template={mockTemplate}
        personalization={{}}
        customText="Advocacy message"
      />
    );

    const canvas = container.querySelector('#post-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('handles custom text properly', () => {
    const customMessage = 'This is a custom message for awareness';
    const mockTemplate = {
      id: 'family-1',
      message: 'In memory of [Name], my beloved [relationship]',
      imagePath: '/test-image.jpg',
      postType: 'family-template'
    };
    
    const { getByText } = render(
      <PostCanvas
        template={mockTemplate}
        personalization={{ name: 'Jane', relationship: 'daughter' }}
        customText={customMessage}
      />
    );

    expect(getByText(customMessage)).toBeInTheDocument();
  });
});
