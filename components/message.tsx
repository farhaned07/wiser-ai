'use client';

import type { ChatRequestOptions, Message } from 'ai';
import { memo, useState } from 'react';
import type { Vote } from '@/lib/db/schema';
import { PencilEditIcon } from './icons';
import { MessageActions } from './message-actions';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  index,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  index: number;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  return (
    <div
      className={cn(
        'group relative mb-4 flex flex-col md:mb-6',
        message.role === 'user' ? 'items-end' : 'items-start'
      )}
      data-message-id={message.id}
    >
      <div
        className={cn(
          'chat-message flex w-full max-w-screen-md flex-col rounded-lg px-4 py-3 sm:max-w-3xl',
          message.role === 'user'
            ? 'chat-message-user self-end bg-primary/10 text-foreground'
            : 'chat-message-ai self-start bg-muted text-foreground'
        )}
      >
        {message.role === 'user' && (
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-xs font-medium uppercase text-foreground/50">
                আপনি
              </div>
            </div>
            {!isReadonly && (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => setMode('edit')}
                >
                  <PencilEditIcon />
                  <span className="sr-only">Edit message</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {message.role === 'assistant' && (
          <div className="mb-1 flex items-center">
            <div className="flex items-center">
              <div className="text-xs font-medium uppercase text-foreground/50">
                উইজার এআই
              </div>
            </div>
          </div>
        )}

        <div className="bangla-text prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
          {message.content ? (
            <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }} />
          ) : (
            <div className="h-[20px] w-full animate-pulse rounded-md bg-secondary" />
          )}
        </div>
      </div>

      {message.role === 'assistant' && !isReadonly && (
        <div className="mt-2 flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <MessageActions
            chatId={chatId}
            message={message}
            vote={vote}
            isLoading={isLoading}
            reload={reload}
          />
        </div>
      )}
    </div>
  );
};

export const PreviewMessage = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.message.content !== nextProps.message.content) return false;
  if (prevProps.message.role !== nextProps.message.role) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isReadonly !== nextProps.isReadonly) return false;
  if (!equal(prevProps.vote, nextProps.vote)) return false;

  return true;
});

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
