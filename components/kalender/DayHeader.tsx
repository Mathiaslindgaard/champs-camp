interface Props { date: Date }

export default function DayHeader({ date }: Props) {
  const label = new Intl.DateTimeFormat('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
  const capitalized = label.charAt(0).toUpperCase() + label.slice(1)

  return (
    <div className="text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm mt-4 mb-2 first:mt-0">
      {capitalized}
    </div>
  )
}
