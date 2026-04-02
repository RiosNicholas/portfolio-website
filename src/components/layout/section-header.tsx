type SectionHeaderProps = {
  description?: string;
  title: string;
}

export function SectionHeader({
  description,
  title, 
}: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-semibold text-white text-2xl md:text-3xl ">
        {title}
      </h2>
      <p className="mt-2 text-zinc-400">{description}</p>
    </div>
  )
}