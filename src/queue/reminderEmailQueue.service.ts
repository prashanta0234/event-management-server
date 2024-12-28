import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ReminderEmailQueueService {
  private readonly transporter;

  constructor(@InjectQueue('reminderEmail') private confirmQueue: Queue) {
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
    await this.confirmQueue.add('sendreminderEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  private initializeWorker() {
    new Worker(
      'reminderEmail',
      async job => {
        const { to, eventName, eventDate, eventLink } = job.data;

        const emailHtml = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f7f9fc;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .email-container {
              max-width: 650px;
              margin: 0 auto;
              padding: 30px;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            h2 {
              color: #4CAF50;
              font-size: 26px;
              margin-bottom: 15px;
              text-transform: uppercase;
            }
            p {
              font-size: 18px;
              line-height: 1.6;
              color: #555;
            }
            .event-info {
              background-color: #f1f1f1;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
            }
            .event-info p {
              margin: 5px 0;
              font-size: 16px;
            }
            .button {
              background-color: #4CAF50;
              color: #fff;
              padding: 12px 24px;
              font-size: 18px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin-top: 20px;
              transition: background-color 0.3s ease;
            }
            .button:hover {
              background-color: #45a049;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #aaa;
              margin-top: 35px;
            }
            .footer a {
              color: #4CAF50;
              text-decoration: none;
            }
            .footer p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2>Reminder: Your Upcoming Event - ${eventName}</h2>
            <p>Hi there,</p>
            <p>We're just reminding you about the event you registered for, which is happening soon!</p>
            
            <div class="event-info">
              <p><strong>Event Name:</strong> ${eventName}</p>
              <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleString()}</p>
              <p><strong>Event Details:</strong> <a href="${eventLink}" target="_blank">Click here for more info</a></p>
            </div>
            
            <p>Make sure you don't miss out on this amazing experience!</p>
            
            <a href="${eventLink}" class="button">View Event Details</a>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
              <p>If you have any questions, feel free to <a href="mailto:support@company.com">contact us</a>.</p>
            </div>
          </div>
        </body>
      </html>
    `;

        try {
          await this.transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to,
            subject: `Reminder: ${eventName} is Tomorrow!`,
            html: emailHtml,
          });
          console.log(`Reminder email sent to ${to}`);
        } catch (error) {
          console.error(`Failed to send reminder email to ${to}`, error);
        }
      },
      { connection: { host: 'localhost', port: 6379 } },
    );
  }
}
