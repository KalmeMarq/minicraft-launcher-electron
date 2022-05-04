import { createContext } from "react";

export const ExtraTranslationContext = createContext('en-US');

const ptPT = {
  'Play': 'Jogar',
  'Installations': 'Instalações',
  'Patch Notes': 'Notas de lançamento',
  
  'New installation': 'Nova instalação',
  'Open Folder': 'Abrir Pasta',
  'Delete': 'Remover',

  'Create new installation': 'Criar nova instalação',
  'Edit installation': 'Editar instalação',
  'Name': 'Nome',
  'Version': 'Versão',
  'Save Directory': 'Caminho do jogo',
  'JVM Arguments': 'Argumentos JVM',
  'unnamed installation': 'instalação sem nome',
  '<Use default directory>': '<Usar caminho padrão>',
  'Browse': 'Procurar',
  'Search': 'Pesquisar',

  'Cancel': 'Cancelar',
  'Create': 'Criar',
  'Save': 'Guardar',

  'Community': 'Comunidade',

  'Settings': 'Definições',
  'General': 'Gerais',
  'Versions': 'Versões',
  'About': 'Sobre',
  'Language': 'Idioma',
  'Launcher Settings': 'Definições do Launcher',
  'Keep the Launcher open while games are running': 'Manter o launcher aberto durante o jogo',
  
  'Credits': 'Créditos',
  'Made by': 'Feito por',
  'Launcher Version': 'Versão do launcher',

  'Downloading': 'A baixar',

  "What's new in the Launcher?": 'Novidades do launcher',
  "What's New": 'Novidades',
  "What's new?": 'Quais a novidades?',

  'Report a Launcher bug': 'Reportar um bug do Launcher',
  'Join Minicraft+ Discord': 'Entrar no discord do Minicraft+',

  'Show community tab': 'Mostrar communidade'
};

const ptBR = ptPT;

export const codes: Record<string, string> = {
  'en-GB': 'en-gb',
  'en-US': 'en',
  'pt-PT': 'pt',
  'pt-BR': 'pt-br'
};

const TLTranslations: Record<string, { [key: string]: string }> = {
  'en-GB': {},
  'en-US': {},
  'pt-PT': ptPT,
  'pt-BR': ptBR
};

export default TLTranslations;
