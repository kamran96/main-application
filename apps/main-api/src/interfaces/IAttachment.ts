import { IBase } from './IBase';

export interface IAttachment extends IBase {
  name: string;
  mimeType: string;
  path: string;
  fileSize: string;
}
