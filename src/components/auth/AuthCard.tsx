import type { ReactNode } from 'react'
import { BrandMark } from '../brand'
import { ThemeToggle } from '../ThemeToggle'
import { Progress } from '../ui/Progress'

type AuthCardProps = {
  title: string
  subtitle: string
  progress?: number
  children: ReactNode
}

export function AuthCard({ title, subtitle, progress, children }: AuthCardProps) {
  return (
    <div className="relative w-full max-w-[440px] overflow-hidden rounded-lg border border-border-soft bg-surface-lowest shadow-lift dark:bg-[#1e1e1e]">
      {progress != null ? <Progress value={progress} /> : null}
      <div className="px-6 py-10 sm:p-12">
        <BrandMark />
        <h1 className="mt-8 font-sans text-[28px] font-bold leading-9 tracking-[-0.01em] text-on-surface md:text-[32px] md:leading-10">
          {title}
        </h1>
        <p className="mt-2 text-[16px] leading-6 text-on-surface-variant">
          {subtitle}
        </p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex justify-end px-6 py-6 md:px-16">
        <ThemeToggle />
      </div>
      <main className="flex flex-1 items-start justify-center px-6 pb-10 md:items-center md:px-16 md:pb-16">
        {children}
      </main>
    </div>
  )
}
