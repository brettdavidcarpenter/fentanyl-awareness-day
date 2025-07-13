
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePostGeneration } from '@/hooks/usePostGeneration';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock-image-data'),
  }),
}));

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
    }),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
};

describe('usePostGeneration Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock DOM element for canvas generation
    const mockElement = {
      id: 'post-canvas',
      getBoundingClientRect: () => ({ width: 540, height: 540 }),
    };
    
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => usePostGeneration(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isGenerating).toBe(false);
    expect(typeof result.current.createPost).toBe('function');
  });

  it('sets generating state during post creation', async () => {
    const { result } = renderHook(() => usePostGeneration(), {
      wrapper: createWrapper(),
    });

    const postData = {
      persona: 'family',
      postType: 'prepopulated' as const,
      template: 'family-1',
      customText: 'Test message',
      personalization: { name: 'John', relationship: 'son' },
    };

    // Start post creation
    const promise = result.current.createPost(postData);
    
    // Should be generating
    expect(result.current.isGenerating).toBe(true);
    
    // Wait for completion
    await promise;
    
    // Should no longer be generating
    expect(result.current.isGenerating).toBe(false);
  });

  it('returns image URL on successful post creation', async () => {
    const { result } = renderHook(() => usePostGeneration(), {
      wrapper: createWrapper(),
    });

    const postData = {
      persona: 'family',
      postType: 'prepopulated' as const,
      template: 'family-1',
    };

    const imageUrl = await result.current.createPost(postData);
    
    expect(imageUrl).toBe('data:image/png;base64,mock-image-data');
  });

  it('handles missing canvas element gracefully', async () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    
    const { result } = renderHook(() => usePostGeneration(), {
      wrapper: createWrapper(),
    });

    const postData = {
      persona: 'family',
      postType: 'prepopulated' as const,
    };

    const imageUrl = await result.current.createPost(postData);
    
    expect(imageUrl).toBeNull();
  });

  it('saves analytics data on successful post creation', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: {}, error: null });
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
    
    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: { from: mockFrom },
    }));

    const { result } = renderHook(() => usePostGeneration(), {
      wrapper: createWrapper(),
    });

    const postData = {
      persona: 'family',
      postType: 'prepopulated' as const,
      template: 'family-1',
    };

    await result.current.createPost(postData);
    
    expect(mockFrom).toHaveBeenCalledWith('day_of_experience_posts');
    expect(mockInsert).toHaveBeenCalledWith({
      persona_type: 'family',
      post_type: 'prepopulated',
      template_used: 'family-1',
    });
  });
});
