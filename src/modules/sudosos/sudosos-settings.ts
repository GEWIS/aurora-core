export interface SudoSOSSettings {
  SudoSOSEnabled: boolean;
  SudoSOSBorrelmodePOSID: number;
  SudoSOSBACGroupID: number;
}

export const SudoSOSSettingsDefault: SudoSOSSettings = {
  SudoSOSEnabled: false,
  SudoSOSBorrelmodePOSID: -1,
  SudoSOSBACGroupID: -1,
};
