export default function getElementPath (element: Element) {
  let current = element

  const list = [element]

  while (current.parentNode) {
    list.push(current.parentNode as Element)
    current = current.parentNode as Element
  }

  return list
}
