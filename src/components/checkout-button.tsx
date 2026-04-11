'use client';

import { useState } from 'react';
import { ReferralModal } from './ReferralModal';

interface CheckoutButtonProps {
  priceId: string;
  children: React.ReactNode;
  className?: string;
}

export function CheckoutButton({ priceId, children, className }: CheckoutButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!priceId}
        className={className}
      >
        {children}
      </button>

      <ReferralModal
        open={open}
        onClose={() => setOpen(false)}
        priceId={priceId || null}
        appName="DuoWealth"
      />
    </>
  );
}
