import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterAttendeeDto } from './dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async RegistrationAttendee(
    data: RegisterAttendeeDto,
  ): Promise<{ accessToken: string }> {
    const isExists = await this.prisma.attendee.findUnique({
      where: {
        email: data.email,
      },
    });
    if (isExists) {
      throw new BadRequestException('Sorry you already registred!');
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.password, saltOrRounds);
    const user = await this.prisma.attendee.create({
      data: { name: data.name, email: data.email, password: hash },
    });
    const payload = { sub: user.email, username: user.name };

    const token = await this.jwtService.signAsync(payload);

    console.log(user);
    return { accessToken: token };
  }
}
