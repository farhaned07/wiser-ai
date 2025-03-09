'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'বাংলা ভাষার ইতিহাস',
      label: 'সম্পর্কে আমাকে বলুন',
      action: 'বাংলা ভাষার ইতিহাস সম্পর্কে আমাকে বলুন',
    },
    {
      title: 'বাংলাদেশের পর্যটন স্থান',
      label: 'সম্পর্কে তথ্য দিন',
      action: 'বাংলাদেশের জনপ্রিয় পর্যটন স্থান সম্পর্কে তথ্য দিন',
    },
    {
      title: 'বাংলা ভাষায় একটি কবিতা',
      label: 'লিখে দিন',
      action: 'বাংলা ভাষায় প্রকৃতি বিষয়ক একটি ছোট কবিতা লিখে দিন',
    },
    {
      title: 'বাংলাদেশের ঐতিহাসিক স্থান',
      label: 'সম্পর্কে জানতে চাই',
      action: 'বাংলাদেশের ঐতিহাসিক স্থান সম্পর্কে জানতে চাই',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start bangla-text"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
