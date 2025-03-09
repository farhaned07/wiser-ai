'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';

import { saveLanguagePreferenceCookie } from '@/app/(chat)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { CheckCircleFillIcon, ChevronDownIcon, GlobeIcon } from './icons';

export type LanguageType = 'bangla' | 'english';

const languages: Array<{
  id: LanguageType;
  label: string;
  nativeLabel: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'bangla',
    label: 'বাংলা',
    nativeLabel: 'বাংলা',
    description: 'বাংলা ভাষায় স্যুইচ করুন',
    icon: <GlobeIcon />,
  },
  {
    id: 'english',
    label: 'ইংরেজি',
    nativeLabel: 'English',
    description: 'ইংরেজি ভাষায় স্যুইচ করুন',
    icon: <GlobeIcon />,
  },
];

export function LanguageSelector({
  selectedLanguageType,
  className,
}: {
  selectedLanguageType: LanguageType;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticLanguageType, setOptimisticLanguageType] =
    useOptimistic(selectedLanguageType);

  const selectedLanguage = useMemo(
    () => languages.find((language) => language.id === optimisticLanguageType),
    [optimisticLanguageType],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          variant="outline"
          className="hidden md:flex md:px-2 md:h-[34px] bangla-text"
        >
          {selectedLanguage?.icon}
          {selectedLanguage?.nativeLabel}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[300px] bangla-text">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.id}
            onSelect={() => {
              setOpen(false);

              startTransition(() => {
                setOptimisticLanguageType(language.id);
                saveLanguagePreferenceCookie(language.id);
              });
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={language.id === optimisticLanguageType}
          >
            <div className="flex flex-col gap-1 items-start">
              {language.label}
              {language.description && (
                <div className="text-xs text-muted-foreground">
                  {language.description}
                </div>
              )}
            </div>
            <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCircleFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 