interface Props { name: string; weightClass: string }

export default function FighterPill({ name, weightClass }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-cc-orange-light border border-cc-orange/30 text-cc-orange rounded-full text-[11px] font-medium px-2.5 py-1 font-dm">
      {name} · {weightClass}
    </span>
  )
}
