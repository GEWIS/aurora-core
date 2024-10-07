import { SecurityGroup } from './security';

export interface ISecuritySections {
  base?: SecurityGroup[];
  privileged?: SecurityGroup[];
  subscriber?: SecurityGroup[];
}

export interface ISecurityGroups {
  user: ISecuritySections;
  audit: ISecuritySections;
  beats: ISecuritySections;
  gdrp: ISecuritySections;
  scenes: ISecuritySections;
  effects: ISecuritySections;
  poster: ISecuritySections;
  centurion: ISecuritySections;
  timetrail: ISecuritySections;
  mode: ISecuritySections;
  handler: ISecuritySections;
  audio: ISecuritySections;
  light: ISecuritySections;
  screen: ISecuritySections;
  lightOperation: ISecuritySections;
  spotify: ISecuritySections;
  sudosos: ISecuritySections;
}

/**
 * Note; destructing inside is not possible, since tsoa access them before compilation
 */
const privilegedSecurityGroups = [SecurityGroup.ADMIN, SecurityGroup.BOARD, SecurityGroup.AVICO];

const baseSecurityGroups = [
  SecurityGroup.ADMIN,
  SecurityGroup.BOARD,
  SecurityGroup.AVICO,
  SecurityGroup.BAC,
];

const allSecurityGroups = [
  SecurityGroup.ADMIN,
  SecurityGroup.BOARD,
  SecurityGroup.AVICO,
  SecurityGroup.BAC,
  SecurityGroup.KEY_HOLDER,
];

/**
 * Security groups that are available for each endpoint
 * Giving specific type will break tsoa; can only be done after the fact
 */
export const securityGroups = {
  user: {
    base: allSecurityGroups,
  },
  audit: {
    base: allSecurityGroups,
  },
  beats: {
    base: baseSecurityGroups,
  },
  gdrp: {
    base: [SecurityGroup.ADMIN],
  },
  scenes: {
    base: baseSecurityGroups,
    privileged: [SecurityGroup.ADMIN, SecurityGroup.AVICO],
  },
  effects: {
    base: baseSecurityGroups,
  },
  poster: {
    base: baseSecurityGroups,
    privileged: privilegedSecurityGroups,
    subscriber: [SecurityGroup.SCREEN_SUBSCRIBER],
  },
  centurion: {
    base: allSecurityGroups,
    privileged: baseSecurityGroups,
  },
  timetrail: {
    base: [SecurityGroup.ADMIN, SecurityGroup.BOARD, SecurityGroup.AVICO, SecurityGroup.BAC],
    subscriber: [SecurityGroup.SCREEN_SUBSCRIBER],
  },
  mode: {
    base: baseSecurityGroups,
  },
  handler: {
    base: allSecurityGroups,
    privileged: baseSecurityGroups,
  },
  audio: {
    base: allSecurityGroups,
    privileged: [SecurityGroup.ADMIN],
    subscriber: [SecurityGroup.AUDIO_SUBSCRIBER],
  },
  light: {
    base: allSecurityGroups,
    privileged: [SecurityGroup.ADMIN],
  },
  screen: {
    base: allSecurityGroups,
    privileged: [SecurityGroup.ADMIN],
  },
  lightOperation: {
    base: baseSecurityGroups,
  },
  spotify: {
    base: allSecurityGroups,
    privileged: [SecurityGroup.ADMIN],
  },
  sudosos: {
    subscriber: [SecurityGroup.SCREEN_SUBSCRIBER],
  },
};

// Since object above cannot be type directly, we cast it here
// Any "big" issues will be caught by Typescript compiler this way
export const typedSecurityGroups = securityGroups as ISecurityGroups;
