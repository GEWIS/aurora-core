import { TimeTrailRaceState } from './time-trail-race-state';

import { ScoreboardItem } from './time-trail-race-entities';

type RaceBaseEvent = {
  sessionName: string;
};

export type RaceInitializedEvent = RaceBaseEvent & {};

export type RacePlayerRegisteredEvent = RaceBaseEvent & {
  state: TimeTrailRaceState.PLAYER_REGISTERED;
  playerName: string;
  scoreboard: ScoreboardItem[];
};

export type RacePlayerReadyEvent = RaceBaseEvent & {
  state: TimeTrailRaceState.PLAYER_READY;
  name: string;
};

export type RaceStartedEvent = RaceBaseEvent & {
  state: TimeTrailRaceState.STARTED;
  name: string;
  startTime: Date;
};

export type RaceFinishedEvent = RaceBaseEvent & {
  state: TimeTrailRaceState.FINISHED;
  name: string;
  timeMs: number;
};

export type RaceScoreboardEvent = RaceBaseEvent & {
  state: TimeTrailRaceState.SCOREBOARD;
  scoreboard: ScoreboardItem[];
  name: string;
  timeMs: number;
};
