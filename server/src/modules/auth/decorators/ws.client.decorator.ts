// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { SafeUserDoc } from '../../../shared/interfaces/auth/SafeUserDoc';
// import { Socket } from 'socket.io';
//
// // extract the user from the websocket connection,
// // use @WsClient to get the user from the websocket connection
// // after the user has been authenticated (validated by the WsAuthStrategy)
//
// // currently not working
// export const WsClient = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): any => {
//     const client = ctx.switchToWs().getClient<Socket>();
//     return client.data.user;
//   },
// );
