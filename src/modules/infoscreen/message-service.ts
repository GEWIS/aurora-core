import { Repository } from 'typeorm';
import Message from './entities/message';
import dataSource from '../../database';

export interface MessageParams {
  user: string;
  message: string;
}

export default class MessageService {
  repo: Repository<Message>;

  constructor() {
    this.repo = dataSource.getRepository(Message);
  }

  public async getMessage(id: string): Promise<Message> {
    return this.repo.findOneByOrFail({ id });
  }

  public async getAllMessages(): Promise<Message[]> {
    return this.repo.find();
  }

  public async createMessage(params: MessageParams): Promise<Message> {
    const message = {
      ...params
    };
    return this.repo.save(message);
  }

  public async updateMessage(id: string, params: Partial<MessageParams>): Promise<Message> {
    const product = await this.getMessage(id);
    await this.repo.update(product.id, params);
    return this.getMessage(product.id);
  }

  public async deleteMessage(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
