'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { VisibilityType, VisibilitySelector } from './visibility-selector';
import { LanguageType, LanguageSelector } from './language-selector';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  selectedLanguageType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  selectedLanguageType: LanguageType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 shadow-sm">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only bangla-text">নতুন চ্যাট</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bangla-text">নতুন চ্যাট</TooltipContent>
        </Tooltip>
      )}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className="order-1 md:order-3"
        />
      )}

      <LanguageSelector
        selectedLanguageType={selectedLanguageType}
        className="order-1 md:order-4"
      />
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  if (prevProps.selectedModelId !== nextProps.selectedModelId) return false;
  if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
    return false;
  if (prevProps.selectedLanguageType !== nextProps.selectedLanguageType)
    return false;
  if (prevProps.isReadonly !== nextProps.isReadonly) return false;

  return true;
});
