
import { test, expect } from '@playwright/test';

test.describe('Day of Experience Flow', () => {
  test('should create and customize a post', async ({ page }) => {
    await page.goto('/day-of-experience');
    
    // Should see the main elements
    await expect(page.getByText('Create Your Fentanyl Awareness Post')).toBeVisible();
    await expect(page.getByText('Live Preview')).toBeVisible();
    
    // Should see persona selection
    await expect(page.getByText('Families & Friends')).toBeVisible();
    await expect(page.getByText('Law Enforcement')).toBeVisible();
    await expect(page.getByText('Recovery Orgs')).toBeVisible();
    
    // Should see personalization fields for family (default)
    await expect(page.getByText('Personalize Your Message')).toBeVisible();
    
    // Fill out personalization using Playwright locators
    await page.locator('input[placeholder*="Enter loved one\'s name"]').fill('John');
    await page.locator('input[placeholder*="son, daughter, friend"]').fill('son');
    
    // Add custom message
    const customMessage = 'This is my custom awareness message';
    await page.locator('textarea[placeholder*="Add your personal message"]').fill(customMessage);
    
    // Should see character count
    await expect(page.getByText(`${customMessage.length}/280 characters`)).toBeVisible();
    
    // Generate post
    await page.getByText('Generate Final Post').click();
    
    // Should see generating state
    await expect(page.getByText('Generating...')).toBeVisible();
    
    // Should return to normal state
    await expect(page.getByText('Generate Final Post')).toBeVisible();
  });

  test('should switch personas correctly', async ({ page }) => {
    await page.goto('/day-of-experience');
    
    // Click law enforcement
    await page.getByText('Law Enforcement').click();
    
    // Should not see personalization fields
    await expect(page.getByText('Personalize Your Message')).not.toBeVisible();
    
    // Switch back to family
    await page.getByText('Families & Friends').click();
    
    // Should see personalization fields again
    await expect(page.getByText('Personalize Your Message')).toBeVisible();
  });

  test('should handle image upload', async ({ page }) => {
    await page.goto('/day-of-experience');
    
    // Should see upload section
    await expect(page.getByText('Upload Your Photo (optional)')).toBeVisible();
    
    // Mock file upload - use proper Playwright file upload
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data'),
    });
    
    // Should show remove image option
    await expect(page.getByText('Remove Image')).toBeVisible();
  });

  test('should copy caption to clipboard', async ({ page }) => {
    await page.goto('/day-of-experience');
    
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Click copy caption
    await page.getByText('Copy Caption').click();
    
    // Should see success toast
    await expect(page.getByText('Caption Copied!')).toBeVisible();
  });
});
