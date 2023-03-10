import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { HealthModule } from './health/health.module';

let MONGO_URI;
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
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.CONTACT_MONGO_URI || MONGO_URI),
    ContactModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
