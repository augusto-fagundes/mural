// Configurações de visibilidade para informações administrativas
export const ADMIN_CONFIG = {
  // Controla se informações do Jira são visíveis na tela inicial
  SHOW_JIRA_INFO_ON_HOME: false,
  
  // Controla se informações do roadmap são visíveis na tela inicial
  SHOW_ROADMAP_INFO_ON_HOME: true,
  
  // Controla se status de desenvolvimento são visíveis na tela inicial
  SHOW_DEV_STATUS_ON_HOME: true,
  
  // Lista de emails de administradores (para futuro uso)
  ADMIN_EMAILS: [
    'admin@empresa.com',
    'joao@empresa.com'
  ]
};

// Função para verificar se um usuário é administrador
export const isAdmin = (email?: string): boolean => {
  if (!email) return false;
  return ADMIN_CONFIG.ADMIN_EMAILS.includes(email.toLowerCase());
};

// Função para verificar se deve mostrar informações do Jira
export const shouldShowJiraInfo = (isHomePage: boolean = false, userEmail?: string): boolean => {
  // Se não estiver na página inicial, sempre mostrar (para admins)
  if (!isHomePage) {
    return true;
  }
  
  // Na página inicial, só mostrar se configurado ou se for admin
  return ADMIN_CONFIG.SHOW_JIRA_INFO_ON_HOME || isAdmin(userEmail);
};