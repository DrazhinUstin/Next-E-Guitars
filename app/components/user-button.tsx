'use client';

import type { members } from '@wix/members';
import { Button, type ButtonProps } from '@/app/components/ui/button';
import {
  CheckIcon,
  LogInIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  UserIcon,
  UserPenIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/app/components/ui/dropdown-menu';
import { useAuth } from '@/app/hooks/use-auth';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import { useTheme } from 'next-themes';

interface Props extends ButtonProps {
  user: members.Member | null;
}

export default function UserButton({ user, ...props }: Props) {
  const { login, logout } = useAuth();
  const { themes, theme: currentTheme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          {...props}
          className={cn('[&_svg]:size-6', props.className)}
        >
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!!user ? (
          <>
            <DropdownMenuLabel>
              Logged in as <span className="text-primary">{user.loginEmail}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem>
                <UserPenIcon />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOutIcon />
              <span>Logout</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Anonymous site visitor</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={login}>
              <LogInIcon />
              <span>Login</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <PaletteIcon />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {themes.map((theme) => (
                <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
                  {theme === 'system' && <MonitorIcon />}
                  {theme === 'light' && <SunIcon />}
                  {theme === 'dark' && <MoonIcon />}
                  <span>{theme}</span>
                  {theme === currentTheme && <CheckIcon />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
