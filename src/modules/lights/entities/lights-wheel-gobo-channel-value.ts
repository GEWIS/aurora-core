import { Entity } from 'typeorm';
import LightsWheelChannelValue from './lights-wheel-channel-value';

@Entity()
export default class LightsWheelGoboChannelValue extends LightsWheelChannelValue<string> {}
