
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Supabase email signup function
  http.post('*/functions/v1/email-signup', async ({ request }) => {
    const body = await request.json() as any;
    
    // Simulate validation
    if (!body?.email || !body.email.includes('@')) {
      return HttpResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Simulate successful signup
    return HttpResponse.json({
      message: 'Successfully registered for reminders',
      data: {
        id: 'test-id-123',
        email: body.email,
        testMode: body.testMode || false,
      },
    });
  }),

  // Mock Supabase database operations
  http.post('*/rest/v1/email_signups', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: 'mock-id',
      email: body?.email || 'test@example.com',
      created_at: new Date().toISOString(),
    });
  }),

  http.post('*/rest/v1/day_of_experience_posts', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: 'mock-post-id',
      ...(body || {}),
      created_at: new Date().toISOString(),
    });
  }),

  http.post('*/rest/v1/button_clicks', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: 'mock-click-id',
      ...(body || {}),
      created_at: new Date().toISOString(),
    });
  }),
];
