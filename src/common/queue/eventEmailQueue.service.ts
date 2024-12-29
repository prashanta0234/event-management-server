import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EventEmailQueueService {
  private readonly transporter;

  constructor(
    @InjectQueue('eventNotificationQueue') private confirmQueue: Queue,
  ) {
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

  async addJob(data: {
    to: string;
    eventName: string;
    eventDate: string;
    eventLink: string;
  }) {
    await this.confirmQueue.add('sendeventAccountEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  private initializeWorker() {
    new Worker(
      'eventNotificationQueue',
      async job => {
        const { to, eventName, eventDate, eventLink } = job.data;

        const emailHtml = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f7fc;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #4CAF50;
              font-size: 24px;
              margin-bottom: 15px;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
            }
            .event-info {
              background-color: #fafafa;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .event-info p {
              margin: 0;
            }
            .button {
              background-color: #4CAF50;
              color: #ffffff;
              padding: 10px 20px;
              font-size: 16px;
              text-decoration: none;
              border-radius: 4px;
              display: inline-block;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #aaa;
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2>You're Invited to the Event: ${eventName}</h2>
            <p>Hi there,</p>
            <p>We're excited to invite you to our upcoming event!</p>
            
            <div class="event-info">
              <p><strong>Event Name:</strong> ${eventName}</p>
              <p><strong>Event Date:</strong> ${eventDate}</p>
              <p><strong>Event Details:</strong> <a href="${eventLink}" target="_blank">Click here for more info</a></p>
            </div>
            
            <p>Don't miss out on this amazing opportunity! We look forward to seeing you there.</p>
            
            <a href="${eventLink}" class="button">Confirm Your Attendance</a>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Prashanta. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

        try {
          await this.transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to,
            subject: `You're Invited to ${eventName}`,
            html: emailHtml,
          });
          console.log(`Event notification email sent to ${to}`);
        } catch (error) {
          console.error(
            `Failed to send event notification email to ${to}`,
            error,
          );
        }
      },
      { connection: { host: 'localhost', port: 6379 } },
    );
  }
}
