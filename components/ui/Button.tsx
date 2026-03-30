interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

const VARIANTS = {
  primary: 'bg-cc-orange text-cc-black font-bold hover:bg-cc-orange-dark active:scale-95',
  outline: 'border border-cc-orange/40 text-cc-orange hover:border-cc-orange active:scale-95',
  ghost:   'border border-cc-black-border text-cc-gray hover:text-cc-white active:scale-95',
}

const SIZES = {
  sm: 'text-[11px] px-3 py-1.5 rounded-lg',
  md: 'text-[13px] px-4 py-2.5 rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`font-dm font-semibold transition-all min-h-0 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
