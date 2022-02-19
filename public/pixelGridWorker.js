const p = 100
self.onmessage = async function (e) {
  var path = []

  for (let i = 0; i < e.data.width; i++) {
    if (onLineOnScreenX(i)) {
      path.push(`M${i} 0 V${e.data.height}`)
    }
  }
  for (let i = 0; i < e.data.height; i++) {
    if (onLineOnScreenY(i)) {
      path.push(`M0 ${i}H${e.data.width}`)
    }
  }

  self.postMessage(path.join(''))

  function onLineOnScreenX (i) {
    const s = e.data.scale
    const w = e.data.viewportWidth
    const x = e.data.posX + (w - e.data.width * s) / 2

    return i * s + x > -p && i * s + x < w + p
  }
  function onLineOnScreenY (i) {
    const s = e.data.scale
    const w = e.data.viewportHeight
    const y = e.data.posY + (w - e.data.height * s) / 2

    return i * s + y > -p && i * s + y < w + p
  }
}
