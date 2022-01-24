export default function bem (
  blockelement: string,
  modifier: string | string[] | null) {
  const mod = modifier ? [modifier].flat() : null

  const className: string[] = [blockelement]

  if (mod) {
    mod.forEach(x => {
      className.push(`${className[0]}--${x}`)
    })
  }

  return className
}
