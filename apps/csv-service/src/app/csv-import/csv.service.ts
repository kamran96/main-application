import { Injectable } from '@nestjs/common';

@Injectable()
export class CsvService {
  constructor() {}

  async importCsv() {
    return 'Hello World!';
  }
}
