export enum SocketioNamespaces {
  BASE = '/',
  AUDIO = '/audio',
  SCREEN = '/screen',
  LIGHTS = '/lights',
  PUBLIC = '/public',
}

export const SECURE_NAMESPACES = [
  SocketioNamespaces.BASE,
  SocketioNamespaces.AUDIO,
  SocketioNamespaces.SCREEN,
  SocketioNamespaces.LIGHTS,
];
