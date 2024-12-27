import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoginAttendeeDto, RegisterAttendeeDto } from './dto';

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

    const hash = await this.hashedPass(data.password);
    const user = await this.prisma.attendee.create({
      data: { name: data.name, email: data.email, password: hash },
    });

    const token = await this.generateToken({
      email: data.email,
      name: data.name,
    });

    console.log(user);
    return { accessToken: token };
  }

  async LoginAttendee(
    data: LoginAttendeeDto,
  ): Promise<{ accessToken: string }> {
    const isExists = await this.prisma.attendee.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!isExists) {
      throw new NotFoundException('Sorry you already registred!');
    }

    if (!bcrypt.compare(data.password, isExists.password)) {
      throw new BadRequestException('Sorry your password not matched');
    }

    const token = await this.generateToken({
      email: data.email,
      name: isExists.name,
    });

    return { accessToken: token };
  }

  async hashedPass(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async generateToken({
    name,
    email,
  }: {
    name: string;
    email: string;
  }): Promise<string> {
    const payload = { sub: email, username: name };

    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
