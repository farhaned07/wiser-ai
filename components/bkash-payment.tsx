'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Premium plan options
const PREMIUM_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 199,
    features: [
      'Unlimited conversations',
      'Advanced Bangla responses',
      'File uploads up to 5MB',
    ],
    durationDays: 30,
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 499,
    features: [
      'All Basic features',
      'Priority response time',
      'File uploads up to 20MB',
      'Custom Bangla dialect options',
    ],
    durationDays: 30,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    features: [
      'All Professional features',
      'Dedicated support',
      'API access',
      'Custom branding',
      'Unlimited file uploads',
    ],
    durationDays: 30,
  },
];

interface BkashPaymentProps {
  onSuccess: (planId: string) => void;
}

export function BkashPayment({ onSuccess }: BkashPaymentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof PREMIUM_PLANS[0] | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenPayment = (plan: typeof PREMIUM_PLANS[0]) => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    if (!phoneNumber || phoneNumber.length < 11) {
      toast.error('Please enter a valid bKash number');
      return;
    }

    setIsProcessing(true);

    try {
      // In a real implementation, this would call your API to initiate bKash payment
      const response = await fetch('/api/payment/bkash/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.price,
          phoneNumber,
          planId: selectedPlan.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to bKash payment page or handle the payment flow
        window.location.href = data.paymentURL;
      } else {
        toast.error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('An error occurred while processing your payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Premium Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREMIUM_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="border rounded-lg p-6 flex flex-col bg-card"
            >
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="text-2xl font-bold my-4">
                ৳{plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /{plan.durationDays} days
                </span>
              </div>
              <ul className="mb-6 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleOpenPayment(plan)}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                Subscribe with bKash
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>bKash Payment</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <>
                  You are subscribing to the {selectedPlan.name} plan for ৳
                  {selectedPlan.price}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                bKash Number
              </Label>
              <Input
                id="phone"
                placeholder="01XXXXXXXXX"
                className="col-span-3"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isProcessing ? 'Processing...' : 'Pay with bKash'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 