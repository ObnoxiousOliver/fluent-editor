export default {
  appMenu: {
    // FILE
    file: { name: 'Fichier', key: 'f' },

    newFile: { name: 'Nouveau', key: 'n' },
    openFile: { name: 'Ouvrir...', key: 'o' },

    save: { name: 'Enregistrer', key: 'e' },
    saveAs: { name: 'Enregistrer sous...', key: 's' },

    export: { name: 'Exporter', key: 'x' },

    exit: { name: 'Fermer', key: 'e' },

    // EDIT
    edit: { name: 'Éditer', key: 'e' },

    undo: { name: 'Annuler', key: 'u' },
    redo: { name: 'Répéter', key: 'r' },

    cut: { name: 'Couper', key: 'o' },
    copy: { name: 'Copier', key: 'c' },
    paste: { name: 'Coller', key: 'p' },

    preferences: { name: 'Préférences...', key: 'p' },

    // HELP
    help: { name: 'Aide', key: 'd' },

    checkForUpdates: { name: 'Rechercher des mises à jour...', key: 'u' },

    about: { name: 'À propos...', key: 'p' }
  },
  search: {
    placeholder: 'Rechercher...'
  },
  document: {
    untitled: 'Sans titre {0}',
    slide: 'Diapositive {0}'
  },
  smallWindowWarning: {
    title: 'Trop petit!',
    detail: 'Il semble que la fenêtre de votre navigateur soit trop petite pour contenir cette application. La taille minimale est de {0} x {1} pixels.'
  },
  input: {
    auto: 'auto',
    mixed: 'mixte'
  },
  auth: {
    email: 'E-Mail',
    password: 'Mot de passe',
    login: {
      title: 'Connexion',
      header: 'Content de te revoir',
      registerLinkText: 'Pas encore de compte?',
      registerLink: 'Enregistrer gratuitement',
      forgotPassword: 'Mot de passe oublié?'
    },
    register: {
      title: 'Créer un nouveau compte',
      header: 'Ravi de te rencontrer',
      loginLinkText: 'Déjà un compte?',
      loginLink: 'Connexion',
      emailInUse: 'E-Mail déjà utilisé',
      invalidEmail: 'E-Mail invalide',
      passwordMismatch: 'Les mots de passe ne correspondent pas'
    }
  }
}
