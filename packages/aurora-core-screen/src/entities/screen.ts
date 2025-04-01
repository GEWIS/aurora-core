import { Entity } from 'typeorm';
import { SubscribeEntity } from '@gewis/aurora-core-util';

@Entity()
export default class Screen extends SubscribeEntity {}
