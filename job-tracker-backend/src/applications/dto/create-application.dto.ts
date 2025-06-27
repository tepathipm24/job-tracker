import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber } from 'class-validator'; 

export class CreateApplicationDto { // Class for data transfer object when creating an application
  @IsString() // Decorator: Ensures 'companyName' is a string
  @IsNotEmpty() // Decorator: Ensures 'companyName' is not empty
  companyName: string; // Property for company name

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsOptional() // Decorator: Makes 'appliedDate' optional
  @IsDateString() // Decorator: Ensures 'appliedDate' is a valid date string
  appliedDate?: Date; // Property for applied date (optional)

  @IsNumber() // Decorator: Ensures 'statusId' is a number
  @IsNotEmpty() // Decorator: Ensures 'statusId' is not empty
  statusId: number; // Property for status ID (should have a default/initial status)

  @IsOptional() // Decorator: Makes 'interviewDate' optional
  @IsDateString()
  interviewDate?: Date; // Property for interview date (optional)

  @IsOptional() // Decorator: Makes 'notes' optional
  @IsString()
  notes?: string; // Property for notes (optional)

  @IsOptional()
  @IsString()
  channel: string;
}