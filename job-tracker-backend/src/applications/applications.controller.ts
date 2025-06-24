import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // @Get()
  // findAll() {
  //   return this.applicationsService.findAll();
  // }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?:number) {
    if(!page || !limit){
      return this.applicationsService.findAll();
    }
    page = Number(page);
    limit = Number(limit);

    return this.applicationsService.paginate(page, limit);
  }

  @Get(':id')
  findOnde(@Param('id') id: string) {
    return this.applicationsService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Patch(':id') // HTTP PATCH (อัปเดต)
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(+id, updateApplicationDto);
  }

  @Delete(':id') // HTTP DELETE
  @HttpCode(HttpStatus.NO_CONTENT) // Status 204
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(+id);
  }
}
