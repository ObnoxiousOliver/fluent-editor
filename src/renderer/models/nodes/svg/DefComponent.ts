export default interface DefComponent {
  tag: string,
  attributes: object,
  children: DefComponent[],
  elementAttributes: object
}
