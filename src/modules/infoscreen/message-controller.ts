import { Controller } from '@tsoa/runtime';
import {
  Body, Get, Post, Route, Put, Delete, Tags, Response,
} from 'tsoa';
import MessageService, { MessageParams } from './message-service';
import Message from './entities/message';
import { InternalError, ValidateErrorJSON } from '../../helpers/customError';

@Route('infoscreen')
@Tags('Infoscreen')
export class MessageController extends Controller {
  @Get('messages')
  @Response<InternalError>(500, 'Internal Server Error')
  public async getAllMessages(): Promise<Message[]> {
    return new MessageService().getAllMessages();
  }

  @Post('message')
  @Response<ValidateErrorJSON>(422, 'Validation failed')
  @Response<InternalError>(500, 'Internal Server Error')
  public async createMessage(
    @Body() params: MessageParams,
  ): Promise<Message> {
    return new MessageService().createMessage(params);
  }

  @Put('message/{id}')
  @Response<ValidateErrorJSON>(422, 'Validation failed')
  @Response<InternalError>(500, 'Internal Server Error')
  public async updateMessage(
    id: string,
    @Body() params: Partial<MessageParams>,
  ): Promise<Message> {
    return new MessageService().updateMessage(id, params);
  }

  @Delete('message/{id}')
  @Response<InternalError>(500, 'Internal Server Error')
  public async deleteMessage(
    id: string,
  ): Promise<void> {
    await new MessageService().deleteMessage(id);
  }
}
