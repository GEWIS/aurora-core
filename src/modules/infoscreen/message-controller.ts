import { Controller } from '@tsoa/runtime';
import {
  Body, Delete, Get, Post, Put, Response, Route, Security, SuccessResponse, Tags, ValidateError,
} from 'tsoa';
import { HttpStatusCode } from 'axios';
import MessageService, { MessageParams } from './message-service';
import Message from './entities/message';
import { SecurityGroup } from '../../helpers/security';

@Route('infoscreen')
@Tags('Infoscreen')
export class MessageController extends Controller {
  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.KEY_HOLDER, SecurityGroup.SCREEN_SUBSCRIBER])
  @Get('messages')
  @SuccessResponse(HttpStatusCode.Ok)
  public async getAllMessages(): Promise<Message[]> {
    return new MessageService().getAllMessages();
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post('message')
  @Response<ValidateError>(HttpStatusCode.BadRequest, 'Invalid Message')
  @SuccessResponse(HttpStatusCode.Created)
  public async createMessage(
    @Body() params: MessageParams,
  ): Promise<Message> {
    return new MessageService().createMessage(params);
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Put('message/{id}')
  @Response<ValidateError>(HttpStatusCode.BadRequest, 'Invalid Message')
  @SuccessResponse(HttpStatusCode.Ok)
  public async updateMessage(
    id: string,
    @Body() params: Partial<MessageParams>,
  ): Promise<Message> {
    return new MessageService().updateMessage(id, params);
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Delete('message/{id}')
  @SuccessResponse(HttpStatusCode.Ok)
  public async deleteMessage(
    id: string,
  ): Promise<void> {
    await new MessageService().deleteMessage(id);
  }
}
