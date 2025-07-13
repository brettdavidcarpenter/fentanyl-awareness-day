
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import EmailSignup from '@/components/EmailSignup';

describe('EmailSignup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email signup form with correct elements', () => {
    render(<EmailSignup location="hero" />);
    
    expect(screen.getByText('Get Your Reminder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByText('Remind me to post on Awareness Day')).toBeInTheDocument();
  });

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup();
    render(<EmailSignup location="hero" />);
    
    const submitButton = screen.getByText('Remind me to post on Awareness Day');
    await user.click(submitButton);
    
    // Should show toast error for empty email
    await waitFor(() => {
      expect(screen.getByText('Email required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<EmailSignup location="hero" />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const submitButton = screen.getByText('Remind me to post on Awareness Day');
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  it('successfully submits valid email', async () => {
    const user = userEvent.setup();
    render(<EmailSignup location="hero" />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const submitButton = screen.getByText('Remind me to post on Awareness Day');
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    // Should show loading state
    expect(screen.getByText('Adding you to the list...')).toBeInTheDocument();
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText("You're on the list!")).toBeInTheDocument();
      expect(screen.getByText("We'll remind you before August 21, 2025")).toBeInTheDocument();
    });
  });

  it('handles different location props correctly', () => {
    const { rerender } = render(<EmailSignup location="hero" />);
    expect(screen.getByText('Get Your Reminder')).toBeInTheDocument();
    
    rerender(<EmailSignup location="cta" />);
    expect(screen.getByText('Get Your Reminder')).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    render(<EmailSignup location="hero" />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const submitButton = screen.getByText('Remind me to post on Awareness Day');
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    expect(screen.getByText('Adding you to the list...')).toBeInTheDocument();
  });
});
