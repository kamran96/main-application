import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { OrganizationModule } from './organization/organization.module';
import { RbacModule } from './rbac/rbac.module';
import { UserModule } from './user/user.module';

console.log(process.env['NODE' + '_ENV'], 'env');
let MONGO_URI;
let jwt_secret;
if (process.env['NODE' + '_ENV'] === 'production') {
  // read from a file

  console.log('okkk');

  const pathToStaticContent = path.join(
    __dirname,
    '../../../vault/secrets/creds'
  );

  console.log(pathToStaticContent, 'path');

  const staticContentFromVault = fs.readFileSync(
    path.join(pathToStaticContent),
    {
      encoding: 'utf8',
    }
  );

  console.log(staticContentFromVault, 'vault');

  // static Content
  const staticContentWithoutLineBreaks = staticContentFromVault.replace(
    /[\r\n]/gm,
    ''
  );
  const staticContentObj = `{${staticContentWithoutLineBreaks}}`;
  const staticContent = JSON.parse(staticContentObj);
  MONGO_URI = staticContent.MONGO_URI;
  jwt_secret = staticContent.JWT_SECRET;
}

export const JWT_SECRET = jwt_secret;

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || MONGO_URI),
    AuthModule,
    UserModule,
    RbacModule,
    OrganizationModule,
    BranchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
