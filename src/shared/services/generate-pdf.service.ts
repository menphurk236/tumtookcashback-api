import { Injectable } from '@nestjs/common';
// import fs from 'fs';
const fs = require('fs');
const pdf = require('pdf-creator-node');
@Injectable()
export class GeneratePdfService {
  async generate(items,customer) {
    var html = fs.readFileSync('./template/pdf-transaction.html', 'utf8');
    var document = {
      html: html,
      data: {
        items: items,
        customer: customer,
      },
      path: './transaction.pdf',
      type: '',
    };
    var options = {
      format: 'A4',
      orientation: 'landscape',
      // orientation: 'portrait',
      border: '10mm',
      // header: {
      //   height: '4mm',
      //   contents: '<div style="text-align: center;">Cashback Tumtook</div>',
      // },
      // footer: {
      //   height: '10mm',
      //   contents: {
      //     first: 'Cashback Tumtook',
      //     2: 'Second page', // Any page number is working. 1-based index
      //     default:
      //       '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      //     last: 'Last Page',
      //   },
      // },
    };
    await pdf
      .create(document, options)
      .then((res) => {
        // console.log(res);
      })
      .catch((error) => {
        // console.error(error);
      });
  }
}
