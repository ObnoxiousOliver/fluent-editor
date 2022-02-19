export default {
  appMenu: {
    // FILE
    file: { name: 'File', key: 'f' },

    newFile: { name: 'New', key: 'n' },
    openFile: { name: 'Open...', key: 'o' },

    save: { name: 'Save', key: 's' },
    saveAs: { name: 'Save as...', key: 'a' },

    export: { name: 'Export', key: 'x' },

    exit: { name: 'Exit', key: 'e' },

    // EDIT
    edit: { name: 'Edit', key: 'e' },

    undo: { name: 'Undo', key: 'u' },
    redo: { name: 'Redo', key: 'r' },

    cut: { name: 'Cut', key: 't' },
    copy: { name: 'Copy', key: 'c' },
    paste: { name: 'Paste', key: 'p' },

    preferences: { name: 'Preferences...', key: 'p' },

    // HELP
    help: { name: 'Help', key: 'h' },

    checkForUpdates: { name: 'Check for updates...', key: 'u' },

    about: { name: 'About...', key: 'a' }
  },
  search: {
    placeholder: 'Search...'
  },
  document: {
    untitled: 'Untitled {0}',
    slide: 'Slide {0}'
  },
  smallWindowWarning: {
    title: 'Too small!',
    detail: 'Seems like your browser window is too small to fit this application. The minimum size is {0} x {1} pixels.'
  },
  properties: {
    layout: {
      name: 'Layout',
      x: 'X',
      y: 'Y',
      w: 'W',
      h: 'H'
    },
    transform: {
      name: 'Transform',
      translate: 'Translate',
      scale: 'Scale'
    }
  },
  input: {
    auto: 'auto',
    mixed: 'Mixed'
  }
}
