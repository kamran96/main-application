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

let MONGO_URI;
let jwt_secret;
let expires;
let base_url;
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
  base_url = staticContent.BASE_URL;
}

export const JWT_SECRET = jwt_secret;
export const EXPIRES = expires;
export const BASE_URL = base_url;

@Module({
  imports: [
    MongooseModule.forRoot(process.env.USER_MONGO_URI || MONGO_URI),
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
