import { Entity } from 'typeorm';
import { WheelColor } from '../color-definitions';
import LightsWheelChannelValue from './lights-wheel-channel-value';

@Entity()
export default class LightsWheelColorChannelValue extends LightsWheelChannelValue<WheelColor> {}
