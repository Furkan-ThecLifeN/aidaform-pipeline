import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsNotEmpty()
  value!: any;
}

export class AidaFormWebhookDto {
  @IsString()
  @IsNotEmpty()
  submission_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers!: AnswerDto[];
}