import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoginDto, RegisterAttendeeDto } from './dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfirmEmailQueueService } from 'src/queue/confimEmailQueue.service';
import { CustomCacheService } from 'src/custom-cache/custom-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private confirmEmailService: ConfirmEmailQueueService,
    private cacheService: CustomCacheService,
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
    const otp = Math.floor(100000 + Math.random() * 900000);

    await this.prisma.attendee.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
        activationToken: otp.toString(),
      },
    });

    const token = await this.generateToken({
      email: data.email,
      role: 'USER',
    });

    this.confirmEmailService.addJob({
      to: data.email,
      confirmationLink: `http://localhost:5000/auth/confirm?token=${otp}`,
    });

    return { accessToken: token };
  }

  async LoginAttendee(data: LoginDto): Promise<{ accessToken: string }> {
    const isExists = await this.prisma.attendee.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!isExists) {
      throw new NotFoundException('Sorry your email not registerd!');
    }

    if (!isExists.isActivate) {
      throw new BadRequestException(
        'Sorry your account not active. Please check email and active your account.',
      );
    }

    if (!bcrypt.compare(data.password, isExists.password)) {
      throw new BadRequestException('Sorry your password not matched');
    }

    const token = await this.generateToken({
      email: data.email,
      role: 'USER',
    });

    return { accessToken: token };
  }

  async adminLogin(data: LoginDto): Promise<{ accessToken: string }> {
    const isExists = await this.prisma.admin.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!isExists) {
      throw new NotFoundException('Sorry your email not registerd!');
    }

    if (!bcrypt.compare(data.password, isExists.password)) {
      throw new BadRequestException('Sorry your password not matched');
    }
    const token = await this.generateToken({
      email: data.email,
      role: 'ADMIN',
    });
    return { accessToken: token };
  }

  async hashedPass(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async generateToken({
    email,
    role,
  }: {
    email: string;
    role: string;
  }): Promise<string> {
    const payload = { sub: email, role: role };

    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async validateOtp(email: string, otp: string): Promise<string> {
    const user = await this.prisma.attendee.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (user.activationToken !== otp) {
      throw new BadRequestException('Invalid OTP!');
    }

    await this.prisma.attendee.update({
      where: {
        email: email,
      },
      data: {
        activationToken: '',
        isActivate: true,
      },
    });

    await this.cacheService.clearActiveAccountsCache();

    return 'Account activated. Please log in.';
  }
}
