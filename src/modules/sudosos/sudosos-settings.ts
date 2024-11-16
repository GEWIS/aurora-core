export interface SudoSOSSettings {
  SudoSOS: boolean;
  'SudoSOS.BorrelmodePOSID': number;
  'SudoSOS.BACGroupID': number;
}

export const SudoSOSSettingsDefault: SudoSOSSettings = {
  SudoSOS: true,
  'SudoSOS.BorrelmodePOSID': -1,
  'SudoSOS.BACGroupID': -1,
};
