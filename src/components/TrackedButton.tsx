import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useButtonTracking } from '@/hooks/useButtonTracking';

interface TrackedButtonProps extends ButtonProps {
  trackingName: string;
  trackingCategory: string;
  trackingPage: string;
  trackingData?: Record<string, any>;
}

export const TrackedButton = React.forwardRef<HTMLButtonElement, TrackedButtonProps>(
  ({ trackingName, trackingCategory, trackingPage, trackingData, onClick, ...props }, ref) => {
    const { trackButtonClick } = useButtonTracking();

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Track the button click
      await trackButtonClick({
        buttonName: trackingName,
        category: trackingCategory,
        pageLocation: trackingPage,
        additionalData: trackingData
      });

      // Call the original onClick handler
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <Button
        {...props}
        onClick={handleClick}
        ref={ref}
      />
    );
  }
);

TrackedButton.displayName = "TrackedButton";