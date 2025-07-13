
# Testing Documentation

This directory contains all testing infrastructure and test files for the Fentanyl Awareness App.

## Test Structure

```
src/test/
├── components/          # Component unit tests
├── hooks/              # Custom hooks tests
├── pages/              # Page component tests
├── data/               # Data/utility tests
├── e2e/                # End-to-end tests
├── mocks/              # MSW mock handlers
├── utils/              # Test utilities
├── setup.ts            # Test setup configuration
└── README.md           # This file
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### E2E Tests
```bash
# Run E2E tests
npm run e2e

# Run E2E tests with UI
npm run e2e:ui
```

## Test Coverage Goals

- **Unit Tests:** 90% code coverage
- **Integration Tests:** 100% critical path coverage
- **E2E Tests:** 100% user journey coverage

## Critical Areas Tested

### Pre-Refactoring Baseline Tests
1. **Email Signup Flow** - Both HeroSection and CTASection
2. **Post Creation** - Complete DayOfExperience workflow
3. **Template System** - Data structure and persona selection
4. **Analytics Tracking** - Button clicks and post generation

### Component Tests
- EmailSignup component with all validation scenarios
- PostCanvas component with different configurations
- DayOfExperience page integration
- Form controls and state management

### Hook Tests
- usePostGeneration with mocked dependencies
- Form validation and submission logic
- Error handling scenarios

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Real user interactions

## Mock Strategy

We use MSW (Mock Service Worker) to mock:
- Supabase API calls
- External service integrations
- Edge function responses

## Test Utilities

Custom render function in `utils/test-utils.tsx` provides:
- React Query client
- Router context
- UI providers
- Toast notifications

## Continuous Integration

Tests run automatically on:
- Every pull request
- Pushes to main branch
- Coverage reports uploaded to Codecov
- E2E tests run on staging deployment

## Writing New Tests

### Component Tests
```typescript
import { render, screen } from '../utils/test-utils';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Hook Tests
```typescript
import { renderHook } from '@testing-library/react';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  it('returns expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe('expected');
  });
});
```

### E2E Tests
```typescript
import { test, expect } from '@playwright/test';

test('user can complete workflow', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Button').click();
  await expect(page.getByText('Success')).toBeVisible();
});
```
