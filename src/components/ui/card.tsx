'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'metric' | 'highlighted';
}

// DuoWealth uses a fixed dark-card theme — no theme provider.
const ds = {
  cardBg: '#0f1f1d',
  cardBorder: '#1f3833',
  cardShadow: 'none' as const,
  cardBlur: undefined as string | undefined,
  cardGradient: undefined as string | undefined,
  borderRadius: '0.75rem',
};
const tc = { primary: '#0d9488' };

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', style, ...props }, ref) => {

    const baseStyle: React.CSSProperties = {
      backgroundColor: ds.cardBg,
      border: `1px solid ${ds.cardBorder}`,
      borderRadius: ds.borderRadius,
      boxShadow: ds.cardShadow !== 'none' ? ds.cardShadow : undefined,
      backdropFilter: ds.cardBlur,
      backgroundImage: ds.cardGradient,
      transition: 'all 0.2s ease',
      ...style,
    };

    if (variant === 'metric') {
      baseStyle.boxShadow = ds.cardShadow !== 'none' ? ds.cardShadow : undefined;
    }

    if (variant === 'highlighted') {
      baseStyle.borderColor = `${tc.primary}4d`;
      baseStyle.boxShadow = `0 4px 16px ${tc.primary}15`;
    }

    return (
      <div
        ref={ref}
        className={`rounded-lg ${className || ''}`}
        style={baseStyle}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
