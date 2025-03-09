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
    name: 'বেসিক',
    price: 199,
    features: [
      'অসীমিত কথোপকথন',
      'উন্নত বাংলা প্রতিক্রিয়া',
      '৫ এমবি পর্যন্ত ফাইল আপলোড',
    ],
    durationDays: 30,
  },
  {
    id: 'pro',
    name: 'প্রফেশনাল',
    price: 499,
    features: [
      'সমস্ত বেসিক বৈশিষ্ট্য',
      'অগ্রাধিকার প্রতিক্রিয়া সময়',
      '২০ এমবি পর্যন্ত ফাইল আপলোড',
      'কাস্টম বাংলা ডায়ালেক্ট অপশন',
    ],
    durationDays: 30,
  },
  {
    id: 'enterprise',
    name: 'এন্টারপ্রাইজ',
    price: 999,
    features: [
      'সমস্ত প্রফেশনাল বৈশিষ্ট্য',
      'ডেডিকেটেড সাপোর্ট',
      'এপিআই অ্যাক্সেস',
      'কাস্টম ব্র্যান্ডিং',
      'অসীমিত ফাইল আপলোড',
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
      toast.error('দয়া করে একটি বৈধ বিকাশ নম্বর লিখুন');
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
        toast.error(data.message || 'পেমেন্ট শুরু করতে ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('আপনার পেমেন্ট প্রক্রিয়া করার সময় একটি ত্রুটি ঘটেছে');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6 bangla-text">প্রিমিয়াম প্ল্যান</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREMIUM_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="border rounded-lg p-6 flex flex-col bg-card hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold bangla-text">{plan.name}</h3>
              <div className="text-2xl font-bold my-4">
                ৳{plan.price}
                <span className="text-sm font-normal text-muted-foreground bangla-text">
                  /{plan.durationDays} দিন
                </span>
              </div>
              <ul className="mb-6 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center mb-2 bangla-text">
                    <svg
                      className="w-4 h-4 mr-2 text-primary"
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
                className="w-full bg-pink-600 hover:bg-pink-700 bangla-text"
              >
                বিকাশ দিয়ে সাবস্ক্রাইব করুন
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="bangla-text">বিকাশ পেমেন্ট</DialogTitle>
            <DialogDescription className="bangla-text">
              {selectedPlan && (
                <>
                  আপনি {selectedPlan.name} প্ল্যানে সাবস্ক্রাইব করছেন ৳
                  {selectedPlan.price} টাকায়।
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right bangla-text">
                বিকাশ নম্বর
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
              className="bg-pink-600 hover:bg-pink-700 bangla-text"
            >
              {isProcessing ? 'প্রক্রিয়াকরণ হচ্ছে...' : 'বিকাশ দিয়ে পেমেন্ট করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 