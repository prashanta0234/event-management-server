import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ConfirmEmailQueueService {
  private readonly transporter;

  constructor(@InjectQueue('confirmAccount') private confirmQueue: Queue) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    this.initializeWorker();
  }

  async addJob(data: { to: string; confirmationLink: string }) {
    await this.confirmQueue.add('sendConfirmAccountEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  private initializeWorker() {
    new Worker(
      'confirmAccount',
      async job => {
        const { to, confirmationLink } = job.data;

        try {
          await this.transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to,
            subject: 'Confirm Your Account',
            html: `<p>Hello,</p><p>Please confirm your account by clicking the link below:</p><a href="${confirmationLink}">Confirm Account</a>`,
          });
          console.log(`Confirmation email sent to ${to}`);
        } catch (error) {
          console.error(`Failed to send confirmation email to ${to}`, error);
        }
      },
      { connection: { host: 'localhost', port: 6379 } },
    );
  }
}
