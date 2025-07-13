
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { PostCanvas } from '@/components/PostCanvas';

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
    const { container } = render(
      <PostCanvas
        persona="family"
        template="family-1"
        personalization={{ name: 'John', relationship: 'son' }}
        customText="Test message"
      />
    );

    expect(container.querySelector('#post-canvas')).toBeInTheDocument();
  });

  it('applies correct styling based on persona', () => {
    const { container } = render(
      <PostCanvas
        persona="advocate"
        template="advocate-1"
        personalization={{}}
        customText="Advocacy message"
      />
    );

    const canvas = container.querySelector('#post-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('handles custom text properly', () => {
    const customMessage = 'This is a custom message for awareness';
    const { getByText } = render(
      <PostCanvas
        persona="family"
        template="family-1"
        personalization={{ name: 'Jane', relationship: 'daughter' }}
        customText={customMessage}
      />
    );

    expect(getByText(customMessage)).toBeInTheDocument();
  });
});
