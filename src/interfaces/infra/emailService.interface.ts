export interface IEmailService {
  sendOtpEmail(toEmail: string, otp: string): Promise<void>;
  sendPasswordResetEmail(toEmail: string, otp: string): Promise<void>;
  sendProviderApprovalEmail(
    toEmail: string,
    technicianName: string
  ): Promise<void>;
  sendProviderRejectionEmail(
    toEmail: string,
    technicianName: string,
    reason?: string
  ): Promise<void>;
  sendEmail(emailData: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }): Promise<void>;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}