import { PartialType } from '@nestjs/mapped-types'; // Import PartialType utility
import { CreateApplicationDto } from './create-application.dto'; // Import CreateApplicationDto

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {} // Extends CreateApplicationDto, making all its properties optional