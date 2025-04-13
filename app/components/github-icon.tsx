'use client';

import { useTheme } from 'next-themes';
import githubIconPNG from '@/public/github-mark.png';
import githubIconPNGWhite from '@/public/github-mark-white.png';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';

export default function GithubIcon({ className }: { className?: string }) {
  const { theme } = useTheme();
  return (
    <Image
      src={theme === 'dark' ? githubIconPNGWhite : githubIconPNG}
      alt="github"
      className={cn('size-5', className)}
    />
  );
}
