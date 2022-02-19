import defaults from '../models/document/defaults'

export function getTextNodeStyleObject () {
  return {
    color: defaults().textNode.color,
    fontFamily: defaults().textNode.fontFamily.join(','),
    fontSize: defaults().textNode.fontSize + 'px',
    '--paragraph-spacing': defaults().textNode.paragraphSpacing + 'px'
  }
}
