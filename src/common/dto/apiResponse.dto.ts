import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseShape {
  @ApiProperty({ example: true })
  ok: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({
    example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  })
  data: {
    accessToken: string;
  };
}
