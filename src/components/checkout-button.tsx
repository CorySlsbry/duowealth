'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReferralModal } from './ReferralModal';

interface CheckoutButtonProps {
  priceId: string;
  children: React.ReactNode;
  className?: string;
}

export function CheckoutButton({ priceId, children, className }: CheckoutButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (!priceId) {
      // Stripe price IDs not configured — fall through to free signup.
      router.push('/signup');
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className}
      >
        {children}
      </button>

      {priceId && (
        <ReferralModal
          open={open}
          onClose={() => setOpen(false)}
          priceId={priceId}
          appName="DuoWealth"
        />
      )}
    </>
  );
}
