export interface ScreenHandlerSettings {
  RoomResponsibleLegacyScreenURL: string;
  HubblePosterScreenHandler: boolean;
  GewisPosterScreenHandler: boolean;
}

export const ScreenHandlerSettingsDefaults: ScreenHandlerSettings = {
  RoomResponsibleLegacyScreenURL: '',
  HubblePosterScreenHandler: false,
  GewisPosterScreenHandler: false,
};
