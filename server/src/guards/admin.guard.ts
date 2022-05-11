import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    //console.log('CTX: ', context.switchToWs().getClient().handshake.headers);

    return true;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

//constructor(private userService: UserService) {}

// canActivate(
//   context: ExecutionContext,
// ): boolean | Promise<boolean> | Observable<boolean> {
//   console.log(
//     'ctx: ',
//     context
//       .switchToWs()
//       .getClient()
//       .handshake.headers.authorization.split(' ')[1],
//   );
//   // const bearerToken =
//   //   context.args[0].handshake.headers.authorization.split(' ')[1];
//   return false;
// }

// canActivate(
//     context: any,
// ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
//   const bearerToken =
//       context.args[0].handshake.headers.authorization.split(' ')[1];
//   try {
//     const decoded = jwt.verify(bearerToken, jwtConstants.secret) as any;
//     return new Promise((resolve, reject) => {
//       return this.userService
//           .findByUsername(decoded.username)
//           .then((user) => {
//             if (user) {
//               resolve(user);
//             } else {
//               reject(false);
//             }
//           });
//     });
//   } catch (ex) {
//     console.log(ex);
//     return false;
//   }
//}
