import { Injectable } from '@nestjs/common';
import formidable = require('formidable');
import * as fs from 'fs';

@Injectable()
export class CsvService {
  constructor() {}

  async importCsv(req, res): Promise<any> {
    let formData = {};
    const csvData = []; // array of objects

    const form = formidable({ multiples: true });
    await form.parse(req, (err, fields, files) => {
      formData = { fields, files };
      const compareData = JSON.parse(fields.compareData);
      const readStream = fs.readFileSync(files.file?.filepath, {
        encoding: 'utf8',
      });

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

      console.log(csvData);

      // console.log(readStream, 'readstream', compareData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fields, files }, null, 2));
    });

    console.log(formData, 'files and fields');
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
