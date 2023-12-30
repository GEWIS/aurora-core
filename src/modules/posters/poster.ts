export enum PosterType {
  AGENDA = 'agenda',
  INFIMA = 'infima',
  IMAGE = 'image',
  LOGO = 'logo',
  EXTERNAL = 'external',
  PHOTO = 'photo',
  VIDEO = 'video',
}

export enum FooterSize {
  FULL = 'full',
  MINIMAL = 'minimal',
  HIDDEN = 'hidden',
}

export interface BasePoster {
  name: string;
  label?: string;
  due?: Date;
  timeout: number;
  footer: FooterSize;
}

export type LocalPoster = BasePoster & {
  type: PosterType.AGENDA | PosterType.INFIMA | PosterType.LOGO,
};

export type MediaPoster = BasePoster & {
  type: PosterType.IMAGE | PosterType.VIDEO | PosterType.EXTERNAL,
  source: string[];
};

export type PhotoPoster = BasePoster & {
  type: PosterType.PHOTO,
  albums: number[],
};

export type Poster = LocalPoster | MediaPoster | PhotoPoster;
