import {Controller, Get, Param, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {ApiExcludeEndpoint} from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get('uploads/transaction/:imgPath')
  seeUploadedTransactionFile(@Param('imgPath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads/transaction' });
  }

  @ApiExcludeEndpoint()
  @Get('uploads/slip/:imgPath')
  seeUploadedSlipFile(@Param('imgPath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads/slip' });
  }

  @ApiExcludeEndpoint()
  @Get('assets/:imgPath')
  seeAssessedFile(@Param('imgPath') image, @Res() res) {
    return res.sendFile(image, { root: './assets' });
  }
}
