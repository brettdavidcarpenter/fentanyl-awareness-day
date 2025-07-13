
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../utils/test-utils';
import PostCanvas from '@/components/PostCanvas';
import { familyTemplates } from '@/data/postTemplates';

describe('PostCanvas Component', () => {
  const mockTemplate = familyTemplates[0];
  
  beforeEach(() => {
    // Mock QRCodeSVG component
    vi.mock('qrcode.react', () => ({
      QRCodeSVG: ({ value, size }: { value: string; size: number }) => (
        <div data-testid="qr-code" data-value={value} data-size={size}>QR Code</div>
      ),
    }));
  });

  it('renders default post canvas with template', () => {
    render(<PostCanvas template={mockTemplate} />);
    
    // Should render image
    const image = screen.getByAltText('Memorial photo');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockTemplate.imagePath);
    
    // Should render message
    expect(screen.getByText(mockTemplate.message)).toBeInTheDocument();
    
    // Should render QR code
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
  });

  it('renders personalized message when personalization provided', () => {
    const personalization = { name: 'John', relationship: 'son' };
    render(
      <PostCanvas 
        template={mockTemplate} 
        personalization={personalization}
      />
    );
    
    const expectedMessage = mockTemplate.message
      .replace('[Name]', 'John')
      .replace('[relationship]', 'son');
    
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('renders custom text when provided', () => {
    const customText = 'This is my custom message for awareness';
    render(
      <PostCanvas 
        template={mockTemplate} 
        customText={customText}
      />
    );
    
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('renders custom image when provided', () => {
    const customImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...';
    render(
      <PostCanvas 
        template={mockTemplate} 
        customImage={customImage}
      />
    );
    
    const image = screen.getByAltText('Memorial photo');
    expect(image).toHaveAttribute('src', customImage);
  });

  it('renders family post layout for family templates', () => {
    const familyTemplate = { ...mockTemplate, postType: 'family-template' };
    render(<PostCanvas template={familyTemplate} />);
    
    // Family posts should only show image with logo, no QR code
    expect(screen.queryByTestId('qr-code')).not.toBeInTheDocument();
    
    // Should have the logo
    const logo = screen.getByAltText('Facing Fentanyl Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders upload post layout correctly', () => {
    render(<PostCanvas template={mockTemplate} postType="upload" />);
    
    // Upload posts should only show image with logo, no QR code
    expect(screen.queryByTestId('qr-code')).not.toBeInTheDocument();
    
    // Should have the logo
    const logo = screen.getByAltText('Facing Fentanyl Logo');
    expect(logo).toBeInTheDocument();
  });

  it('has correct canvas dimensions', () => {
    render(<PostCanvas template={mockTemplate} />);
    
    const canvas = screen.getByTestId('post-canvas') || 
                  document.querySelector('#post-canvas');
    
    if (canvas) {
      expect(canvas).toHaveClass('w-[540px]', 'h-[540px]');
    }
  });
});
