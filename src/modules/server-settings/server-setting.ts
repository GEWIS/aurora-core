import { Column, Entity } from 'typeorm';
import BaseEntity from '../root/entities/base-entity';
import { SudoSOSSettings, SudoSOSSettingsDefault } from '../sudosos/sudosos-settings';
import { ModeSettings, ModeSettingsDefaults } from '../modes/mode-settings';
import {
  ScreenHandlerSettings,
  ScreenHandlerSettingsDefaults,
} from '../handlers/screen/screen-handler-settings';
import { OrderSettings, OrderSettingsDefault } from '../orders/order-settings';

export interface ISettings
  extends SudoSOSSettings,
    ModeSettings,
    ScreenHandlerSettings,
    OrderSettings {}

export const SettingsDefaults: ISettings = {
  ...SudoSOSSettingsDefault,
  ...ModeSettingsDefaults,
  ...ScreenHandlerSettingsDefaults,
  ...OrderSettingsDefault,
};

/**
 * Key-value store
 */
@Entity()
export default class ServerSetting<T extends keyof ISettings = keyof ISettings> extends BaseEntity {
  @Column({ unique: true })
  public key: T;

  /**
   * JSON-stored value
   */
  @Column({
    type: 'varchar',
    transformer: {
      from(value: string | null): number[] | null {
        if (value == null) return null;
        return JSON.parse(value);
      },
      to(value: number[] | null): string | null {
        if (value == null) return null;
        return JSON.stringify(value);
      },
    },
  })
  public value: ISettings[T];
}
