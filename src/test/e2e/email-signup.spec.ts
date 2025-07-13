
import { test, expect } from '@playwright/test';

test.describe('Email Signup Flow', () => {
  test('should complete email signup successfully on home page', async ({ page }) => {
    await page.goto('/');
    
    // Should see the email signup form
    await expect(page.getByText('Get Your Reminder')).toBeVisible();
    
    // Fill out email form
    const emailInput = page.getByPlaceholder('Enter your email address');
    await emailInput.fill('test@example.com');
    
    // Submit form
    await page.getByText('Remind me to post on Awareness Day').click();
    
    // Should see loading state
    await expect(page.getByText('Adding you to the list...')).toBeVisible();
    
    // Should see success message
    await expect(page.getByText("You're on the list!")).toBeVisible();
    await expect(page.getByText("We'll remind you before August 21, 2025")).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/');
    
    const emailInput = page.getByPlaceholder('Enter your email address');
    await emailInput.fill('invalid-email');
    
    await page.getByText('Remind me to post on Awareness Day').click();
    
    // Should show validation error
    await expect(page.getByText('Invalid email')).toBeVisible();
  });
});
