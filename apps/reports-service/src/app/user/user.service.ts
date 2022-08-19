import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JournalReport } from '../schemas/jurnalReport.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(JournalReport.name) private jurnalReportModel) {}

  async InvoiceCreated(data) {
    const findJurnalReport = await this.jurnalReportModel.find();

    if (findJurnalReport) {
     new this.jurnalReportModel({
        ...data,
        numberOfInvoices: findJurnalReport.length + 2,
      });
    } else {
     new this.jurnalReportModel({
        ...data,
        numberOfInvoices: 1,
      });
    }
  }
}
