export default function () : string {
  return Array.from(crypto.getRandomValues(new Uint32Array(1)))
    .map(x => x.toString(36)).join('')
}
