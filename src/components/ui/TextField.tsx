import * as Label from '@radix-ui/react-label'
import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export function TextField({
  label,
  error,
  className,
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`

  return (
    <div className="flex flex-col gap-2">
      <Label.Root
        htmlFor={fieldId}
        className="text-[14px] font-semibold leading-5 tracking-[0.01em] text-on-surface"
      >
        {label}
      </Label.Root>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-12 rounded-lg border bg-surface-lowest px-4 text-[16px] leading-6 text-on-surface outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-outline dark:bg-[#252525]',
          error
            ? 'border-error focus:border-error focus:shadow-[0_0_0_2px_rgb(186_26_26_/_0.2)]'
            : 'border-border-soft focus:border-primary-action focus:shadow-[0_0_0_2px_rgb(76_175_80_/_0.2)]',
          className,
        )}
        {...props}
      />
      {error ? (
        <span id={errorId} className="text-[12px] font-medium leading-4 text-error">
          {error}
        </span>
      ) : null}
    </div>
  )
}
