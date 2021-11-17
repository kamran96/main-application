import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as aws from 'aws-sdk';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
// const fs = require('fs').promises;
import { buildPaths } from '../buildPath';

import { AttachmentRepository, BranchRepository } from '../repositories';
import { EmailService } from '../Common/services/email.service';

const spacesEndpoint: any = new aws.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: '7HZDHJARFO3DENGQY6XP',
  secretAccessKey: 'lOoHek25WXG2V4x1iDINSzPkPMPG+oC3lCLOARWUt5o',
});

@Injectable()
export class AttachmentService {
  constructor(private email: EmailService) {}

  async fileUpload(req, res): Promise<any> {
    try {
      this.upload(req, res, async function (error) {
        if (error) {
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }

        const { key, mimetype, size, location } = req.files[0];
        const attachmentRepository = getCustomRepository(AttachmentRepository);
        const attachment = await attachmentRepository.save({
          name: key,
          mimeType: mimetype,
          fileSize: size,
          path: location,
          createdBy: req.user.userId,
          updatedBy: req.user.userId,
          tenantId: req.user.tenantId,
          status: 1,
        });
        return res.status(201).json({
          message: 'Successfully uploaded attachment',
          attachment,
        });
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  upload = multer({
    storage: multerS3({
      s3,
      bucket: 'invyce',
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('file', 1);

  async createPdf(body, req): Promise<any> {
    try {
      console.log('Starting: Generating PDF Process, Kindly wait ..');
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      await page.setContent(body.html, { waitUntil: 'networkidle0' });
      // const html = `<div style="font-size: 9px; text-align: right; width: 100%; position: fixed; bottom: 8px; right: 8px; color: gray;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>`;
      const pdf = await page.pdf({
        format: 'A4',
        displayHeaderFooter: false,
        printBackground: true,
        // footerTemplate: html,
        margin: {
          bottom: '8px',
        },
      });

      await browser.close();

      fs.writeFileSync(buildPaths.buildPathPdf, pdf);

      const [branch] = await getCustomRepository(BranchRepository).find({
        where: {
          id: req.user.branchId,
        },
      });

      await this.email
        .compose(
          body.email,
          body.subject,
          body.message,
          'no-reply@invyce.com',
          '',
          [
            {
              filename: 'build.pdf',
              path: 'build.pdf',
              contentType: 'application/pdf',
            },
          ],
          body.cc,
          body.bcc
        )
        .send();

      console.log('Ending: Generating PDF Process');
      return pdf;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
