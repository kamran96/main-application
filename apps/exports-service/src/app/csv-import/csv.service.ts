import { Injectable } from '@nestjs/common';

@Injectable()
export class CsvService {
  constructor() {}

  async importCsv(body) {
    return 'Hello World!';
  }
}
