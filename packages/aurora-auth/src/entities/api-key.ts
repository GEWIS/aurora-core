import { BaseEntity, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Audio, LightsController, Screen } from '@gewis/aurora-core/modules/root/entities';
import { IntegrationUser } from '../integration/entities/index';
import { AuthUser } from '@gewis/aurora-core/modules/auth/auth-user';
import { SecurityGroup } from '@gewis/aurora-core/helpers/security';

@Entity()
export default class ApiKey extends BaseEntity {
  @PrimaryColumn()
  public key: string;

  @OneToOne(/* v8 ignore next */ () => Screen, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public screen?: Screen | null;

  @OneToOne(/* v8 ignore next */ () => LightsController, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  public lightsController?: LightsController | null;

  @OneToOne(/* v8 ignore next */ () => Audio, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public audio?: Audio | null;

  @OneToOne(/* v8 ignore next */ () => IntegrationUser, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  public integrationUser?: IntegrationUser | null;

  public asAuthUser(): AuthUser {
    const roles: SecurityGroup[] = [];
    let endpoints: string[] | undefined;
    const names: string[] = [];
    const ids: string[] = [];
    if (this.audio) {
      roles.push(SecurityGroup.AUDIO_SUBSCRIBER);
      names.push(this.audio.name);
      ids.push(`audio${this.audio.id}`);
    }
    if (this.screen) {
      roles.push(SecurityGroup.SCREEN_SUBSCRIBER);
      names.push(this.screen.name);
      ids.push(`screen${this.screen.id}`);
    }
    if (this.lightsController) {
      roles.push(SecurityGroup.LIGHTS_SUBSCRIBER);
      names.push(this.lightsController.name);
      ids.push(`lightsController${this.lightsController.id}`);
    }
    if (this.integrationUser) {
      roles.push(SecurityGroup.INTEGRATION_USER);
      names.push(this.integrationUser.name);
      ids.push(`integrationUser${this.integrationUser.id}`);
      endpoints = this.integrationUser.endpoints;
    }

    return {
      id: ids.join('-'),
      name: names.join('-'),
      roles,
      endpoints,
      audioId: this.audio?.id,
      screenId: this.screen?.id,
      lightsControllerId: this.lightsController?.id,
      integrationUserId: this.integrationUser?.id,
    };
  }
}
