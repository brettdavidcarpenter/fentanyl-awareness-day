import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrackButtonClickParams {
  buttonName: string;
  category: string;
  pageLocation: string;
  additionalData?: Record<string, any>;
}

export const useButtonTracking = () => {
  // Generate or get session ID
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('tracking_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem('tracking_session_id', sessionId);
    }
    return sessionId;
  }, []);

  const trackButtonClick = useCallback(async ({
    buttonName,
    category,
    pageLocation,
    additionalData
  }: TrackButtonClickParams) => {
    try {
      const sessionId = getSessionId();
      
      const { error } = await supabase
        .from('button_clicks')
        .insert({
          button_name: buttonName,
          page_location: pageLocation,
          button_category: category,
          user_session_id: sessionId,
          additional_data: additionalData || null
        });

      if (error) {
        console.error('Button tracking error:', error);
      }
    } catch (error) {
      console.error('Button tracking failed:', error);
    }
  }, [getSessionId]);

  return { trackButtonClick };
};