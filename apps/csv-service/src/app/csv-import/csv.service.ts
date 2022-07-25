import { Integrations, useApiCallback, Host } from '@invyce/global-constants';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import formidable = require('formidable');
import * as fs from 'fs';

enum Modules {
  CONTACT = 'contact',
  ACCOUNTS = 'accounts',
  INVOICE = 'invoice',
  PAYMENT = 'payment',
  ITEMS = 'items',
}
@Injectable()
export class CsvService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  getData(): { message: string } {
    return { message: 'Welcome to contacts!' };
  }

  async importCsv(req, res): Promise<any> {


   
    if (!req || !req.cookies) return null;
    const token = req.cookies['access_token'];

    const http = axios.create({
      baseURL: 'https://localhost',
      headers: {
        cookie: `access_token=${token}`,
      },
    });
    let formData = {};
    const csvData = []; // array of objects



    const form = formidable({ multiples: true });
  
    await form.parse(req, async (err, fields, files) => {
      formData = { fields, files };

      console.log(files.file, "what is it")

      const compareData = JSON.parse(fields.compareData);
      const readStream = fs.readFileSync(files.file?.path, {
        encoding: 'utf8',
      });

    
      const moduleType = JSON.parse(fields.module);

      const string = readStream.replace('\r', '');
      const lbreak = string.split('\n');
      const accessors = lbreak[0].split(',');

      for (let i = 1; i < lbreak.length; i++) {
        const obj = {};
        lbreak[i].split(',').forEach((item, index) => {
          obj[compareData[accessors[index]]] = `${item.replace('\r', '')}`;
        });
        csvData.push(obj);
      }
      switch (moduleType) {
        case Modules.CONTACT:
          const transactions: Object = JSON.parse(fields.transactions);
          console.log(csvData)
          await http.post('/contacts/contact/sync', {
            contacts: csvData,
            type: Integrations.CSV_IMPORT,
            transactions
          }); 
          break;
        case Modules.ITEMS:
          // eslint-disable-next-line no-case-declarations
          const targetAccounts: unknown = JSON.parse(fields.targetAccounts);

           await axios.post(
            Host('items', 'items/item/sync'),
            {
              type: Integrations.CSV_IMPORT,
            items: csvData,
            targetAccounts: targetAccounts,
            },
            {
              headers: {
                cookie: `access_token=${token}`,
              },
            }
          ); 
          break;
      }
      // console.log(readStream, 'readstream', compareData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fields, files }, null, 2));
    });
  }

  async readMultipartFormData(req, res): Promise<any> {
    const form = formidable({ multiples: true });
    return await form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fields, files }, null, 2));
    });
  }

  async readDocument(file) {
    const obj_csv = {
      size: 0,
      dataFile: [],
    };
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      obj_csv.size = e.total;
      obj_csv.dataFile = e.target.result as any;
      this.parseData(obj_csv.dataFile);
    };
  }

  async parseData(data) {
    const csvData = []; // array of objects
    const string = data.replace('\r', '');
    const lbreak = string.split('\n');
    const accessors = lbreak[0].split(',');
    console.log(accessors, 'accessors');

    for (let i = 1; i < lbreak.length; i++) {
      const obj = {};
      lbreak[i].split(',').forEach((item, index) => {
        obj[accessors[index]] = `${item.replace('\r', '')}`;
      });
      csvData.push(obj);
    }

    // lbreak.forEach((res) => {
    //   csvData.push(res.split(','));
    // });
    console.log(csvData);
  }
}
