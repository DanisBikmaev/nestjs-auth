import { PartialType } from '@nestjs/swagger';
import { CreateBcardDto } from './create-bcard.dto';

export class UpdateBcardDto extends PartialType(CreateBcardDto) {
  title?: string | undefined;
  description?: string | undefined;
}
