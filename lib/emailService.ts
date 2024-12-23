// lib/emailService.ts
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'support@lutbuilder.ai',
        pass: 'Win@x42t1'
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const defaultOptions = {
        from: 'support@lutbuilder.ai'
      };

      const mailOptions = { ...defaultOptions, ...options };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  async sendSignupNotification(email: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to LUTBuilder.ai, ${name}!</h2>
        <p>Thank you for signing up. We're excited to have you on board!</p>
        <p>Start creating amazing color grades with our AI-powered LUT generator.</p>
        <a href="https://lutbuilder.ai" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to LUTBuilder.ai',
      html
    });
  }

  async sendPaymentConfirmation(email: string, name: string, plan: string, amount: number) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Confirmation</h2>
        <p>Hi ${name},</p>
        <p>Thank you for your purchase of the ${plan} plan.</p>
        <p>Amount Paid: $${amount.toFixed(2)}</p>
        <p>You can now enjoy unlimited AI-powered LUT generation!</p>
        <a href="https://lutbuilder.ai" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Payment Confirmation - LUTBuilder.ai',
      html
    });
  }

  async sendAdminNotification(type: 'signup' | 'payment', details: any) {
    const html = type === 'signup' 
      ? `New User Signup: ${details.email} (${details.name})`
      : `New Payment: ${details.email} (${details.plan}, $${details.amount})`;

    return this.sendEmail({
      to: 'support@lutbuilder.ai',
      subject: `${type === 'signup' ? 'New User' : 'Payment'} Notification`,
      html
    });
  }
}

export default new EmailService();