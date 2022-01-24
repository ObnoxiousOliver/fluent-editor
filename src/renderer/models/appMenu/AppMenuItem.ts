export default interface AppMenuItem {
  id: string,
  icon?: string
  name?: string,
  altKeyShortcutLetter?: string,
  action?: string,
  role?: 'divider' | 'button',
  submenu?: AppMenuItem[]
}
