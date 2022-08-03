import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { HealthModule } from './health/health.module';
import { OrganizationModule } from './organization/organization.module';
import { RbacModule } from './rbac/rbac.module';
import { UserModule } from './user/user.module';

console.log(process.env['NODE' + '_ENV'], 'nodeenv');
let MONGO_URI;
let jwt_secret;
let expires;
if (
  process.env['NODE' + '_ENV'] === 'production' ||
  process.env['NODE' + '_ENV'] === 'staging'
) {
  // read from a file

  const pathToStaticContent = path.join(
    __dirname,
    '../../../vault/secrets/creds'
  );

  const staticContentFromVault = fs.readFileSync(
    path.join(pathToStaticContent),
    {
      encoding: 'utf8',
    }
  );

  // static Content
  const staticContentWithoutLineBreaks = staticContentFromVault.replace(
    /[\r\n]/gm,
    ''
  );
  const staticContentObj = `{${staticContentWithoutLineBreaks}}`;
  const staticContent = JSON.parse(staticContentObj);
  MONGO_URI = staticContent.MONGO_URI;
  jwt_secret = staticContent.JWT_SECRET;
  expires = staticContent.EXPIRES;
}

export const JWT_SECRET = jwt_secret;
export const EXPIRES = expires;
console.log(JWT_SECRET, EXPIRES, 'noooooooooooooooooo');

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || MONGO_URI),
    AuthModule,
    UserModule,
    RbacModule,
    OrganizationModule,
    BranchModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
