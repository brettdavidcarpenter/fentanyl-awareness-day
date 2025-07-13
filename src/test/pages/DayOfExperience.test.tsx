
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '../utils/test-utils';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import DayOfExperience from '@/pages/DayOfExperience';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock-image'),
  }),
}));

describe('DayOfExperience Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main page elements', () => {
    render(<DayOfExperience />);
    
    expect(screen.getByText('Create Your Fentanyl Awareness Post')).toBeInTheDocument();
    expect(screen.getByText('Customize your message and see it come to life instantly')).toBeInTheDocument();
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
  });

  it('renders form controls and preview sections', () => {
    render(<DayOfExperience />);
    
    // Form controls section
    expect(screen.getByText('Choose Your Role')).toBeInTheDocument();
    expect(screen.getByText('Families & Friends')).toBeInTheDocument();
    expect(screen.getByText('Law Enforcement')).toBeInTheDocument();
    expect(screen.getByText('Recovery Orgs')).toBeInTheDocument();
    
    // Preview section
    expect(screen.getByText('Your changes appear instantly below')).toBeInTheDocument();
    expect(screen.getByText('Generate Final Post')).toBeInTheDocument();
  });

  it('allows persona selection', async () => {
    const user = userEvent.setup();
    render(<DayOfExperience />);
    
    const lawEnforcementButton = screen.getByText('Law Enforcement');
    await user.click(lawEnforcementButton);
    
    // Should show law enforcement is selected (button styling changes)
    expect(lawEnforcementButton).toHaveClass('bg-primary');
  });

  it('shows personalization fields for family persona', async () => {
    const user = userEvent.setup();
    render(<DayOfExperience />);
    
    // Family should be selected by default, personalization should be visible
    expect(screen.getByText('Personalize Your Message')).toBeInTheDocument();
    expect(screen.getByLabelText("Loved One's Name")).toBeInTheDocument();
    expect(screen.getByLabelText('Your Relationship')).toBeInTheDocument();
  });

  it('hides personalization fields for non-family personas', async () => {
    const user = userEvent.setup();
    render(<DayOfExperience />);
    
    const lawEnforcementButton = screen.getByText('Law Enforcement');
    await user.click(lawEnforcementButton);
    
    // Should not show personalization for law enforcement
    expect(screen.queryByText('Personalize Your Message')).not.toBeInTheDocument();
  });

  it('allows custom message input', async () => {
    const user = userEvent.setup();
    render(<DayOfExperience />);
    
    const customMessageTextarea = screen.getByLabelText('Your Message (optional)');
    const testMessage = 'This is my custom awareness message';
    
    await user.type(customMessageTextarea, testMessage);
    
    expect(customMessageTextarea).toHaveValue(testMessage);
  });

  it('shows character count for custom message', async () => {
    const user = userEvent.setup();
    render(<DayOfExperience />);
    
    const customMessageTextarea = screen.getByLabelText('Your Message (optional)');
    await user.type(customMessageTextarea, 'Test message');
    
    expect(screen.getByText('12/280 characters')).toBeInTheDocument();
  });

  it('generates post when generate button clicked', async () => {
    const user = userEvent.setup();
    render(<DayOfExperience />);
    
    const generateButton = screen.getByText('Generate Final Post');
    await user.click(generateButton);
    
    expect(screen.getByText('Generating...')).toBeInTheDocument();
    
    await vi.waitFor(() => {
      expect(screen.getByText('Generate Final Post')).toBeInTheDocument();
    });
  });

  it('copies caption when copy button clicked', async () => {
    const user = userEvent.setup();
    const mockWriteText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
    });
    
    render(<DayOfExperience />);
    
    const copyButton = screen.getByText('Copy Caption');
    await user.click(copyButton);
    
    expect(mockWriteText).toHaveBeenCalled();
  });

  it('shows tool sharing section', () => {
    render(<DayOfExperience />);
    
    expect(screen.getByText('💫 Help Others Create Posts Too')).toBeInTheDocument();
    expect(screen.getByText('Share this tool so others can create their own awareness posts')).toBeInTheDocument();
    expect(screen.getByText('Share on X')).toBeInTheDocument();
    expect(screen.getByText('Share on Facebook')).toBeInTheDocument();
  });

  it('handles image upload', async () => {
    const user = userEvent.setup();
    render(<DayOfExperience />);
    
    const fileInput = screen.getByLabelText('Click to upload your own image');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    await user.upload(fileInput, file);
    
    // Should show remove image button after upload
    await vi.waitFor(() => {
      expect(screen.getByText('Remove Image')).toBeInTheDocument();
    });
  });
});
