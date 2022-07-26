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
if (process.env['NODE' + '_ENV'] !== 'development') {
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

  if (process.env['NODE' + '_ENV'] === 'staging') {
    console.log('staging');
    MONGO_URI = staticContent.STAGE_MONGO_URI;
  } else if (process.env['NODE' + '_ENV'] === 'production') {
    console.log('production');
    MONGO_URI = staticContent.MONGO_URI;
  }
}

console.log(MONGO_URI, 'uri');

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
