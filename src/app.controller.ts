<<<<<<< HEAD
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
=======
import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('/')
  getRoot(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'public', 'ui', 'login.html'));
>>>>>>> docs/specs
  }
}
