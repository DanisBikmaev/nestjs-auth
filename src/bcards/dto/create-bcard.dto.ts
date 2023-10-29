import { ApiProperty } from '@nestjs/swagger';

export class CreateBcardDto {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
}
