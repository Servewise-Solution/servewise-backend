import { injectable } from "tsyringe";
import { EmailType, APP_NAME } from "../constants/emailTypes.js";
import type { IemailTemplateService } from "../interfaces/infra/emailTemplate.interface.js";

export interface EmailContentResult {
  html: string;
  text: string;
}

export interface OtpEmailData {
  otp: string;
  expiryTime: string;
}

export interface TechnicianApprovalData {
  technicianName: string;
}

export interface TechnicianRejectionData {
  technicianName: string;
  reason?: string;
}

export type EmailData =
  | OtpEmailData
  | TechnicianApprovalData
  | TechnicianRejectionData

@injectable()
export class EmailTemplateService implements IemailTemplateService {
  private appName: string = APP_NAME;

  generateEmailContent(type: EmailType, data: EmailData): EmailContentResult {
    try {
      const templates = this.getEmailTemplates();
      const template = templates[type as keyof typeof templates];

      if (!template) {
        throw new Error(`Email template not found for type: ${type}`);
      }

      return {
        html: this.buildHtmlEmail(
          template.subject,
          template.getHtmlContent(data)
        ),
        text: template.getTextContent(data),
      };
    } catch (error) {
      throw new Error(`Failed to generate ${type} email, ${error}`);
    }
  }

  private buildHtmlEmail(subject: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f7fa;
            padding: 20px 0;
          }
          
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
          }
          
          .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: 0.5px;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .content p {
            color: #555555;
            font-size: 16px;
            margin-bottom: 16px;
            line-height: 1.8;
          }
          
          .content strong {
            color: #333333;
            font-weight: 600;
          }
          
          .otp-container {
            background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
            border: 2px dashed #667eea;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
          }
          
          .otp-label {
            font-size: 14px;
            color: #666666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .otp {
            font-size: 36px;
            font-weight: 700;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
          }
          
          .otp-expiry {
            font-size: 14px;
            color: #888888;
            margin-top: 12px;
          }
          
          .success-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 25px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: white;
          }
          
          .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 25px 0;
            border-radius: 6px;
          }
          
          .info-box p {
            margin-bottom: 0;
          }
          
          .warning-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 25px 0;
            border-radius: 6px;
          }
          
          .warning-box p {
            color: #856404;
            margin-bottom: 0;
          }
          
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
          }
          
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e0e0e0, transparent);
            margin: 30px 0;
          }
          
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
          }
          
          .footer-greeting {
            font-size: 15px;
            color: #555555;
            margin-bottom: 8px;
            font-weight: 500;
          }
          
          .footer-team {
            font-size: 15px;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 20px;
          }
          
          .footer-copyright {
            font-size: 13px;
            color: #999999;
            margin-top: 15px;
          }
          
          .footer-links {
            margin-top: 20px;
          }
          
          .footer-links a {
            color: #667eea;
            text-decoration: none;
            font-size: 13px;
            margin: 0 10px;
          }
          
          .social-icons {
            margin-top: 20px;
          }
          
          .social-icons a {
            display: inline-block;
            width: 36px;
            height: 36px;
            background-color: #e8ecf1;
            border-radius: 50%;
            margin: 0 6px;
            line-height: 36px;
            text-align: center;
            color: #667eea;
            text-decoration: none;
            font-size: 16px;
          }
          
          @media only screen and (max-width: 600px) {
            .email-wrapper {
              border-radius: 0;
              margin: 0;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .header h1 {
              font-size: 24px;
            }
            
            .content {
              padding: 30px 20px;
            }
            
            .otp {
              font-size: 28px;
              letter-spacing: 4px;
            }
            
            .footer {
              padding: 25px 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>${this.appName}</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p class="footer-greeting">Best regards,</p>
            <p class="footer-team">The ${this.appName} Team</p>
            <div class="divider"></div>
            <p class="footer-copyright">&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
            <div class="footer-links">
              <a href="#">Help Center</a> •
              <a href="#">Privacy Policy</a> •
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getEmailTemplates() {
    return {
      [EmailType.SIGNUP_OTP]: {
        subject: "Verify Your Account",
        getHtmlContent: (data: EmailData) => {
          const otpData = data as OtpEmailData;
          return `
          <p>Hello there! 👋</p>
          <p>Welcome to <strong>${this.appName}</strong>! We're excited to have you on board.</p>
          <p>To complete your registration, please verify your account using the code below:</p>
          <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp">${otpData.otp}</div>
            <div class="otp-expiry">⏱️ This code expires in ${otpData.expiryTime}</div>
          </div>
          <div class="info-box">
            <p><strong>Security Tip:</strong> Never share this code with anyone. Our team will never ask for your verification code.</p>
          </div>
        `;
        },
        getTextContent: (data: EmailData) => {
          const otpData = data as OtpEmailData;
          return `
          Verify Your Account
          
          Please use this code to verify your account: ${otpData.otp}
          This code expires in ${otpData.expiryTime}.
          
          Best regards,
          The ${this.appName} Team
        `;
        },
      },

      [EmailType.PASSWORD_RESET_OTP]: {
        subject: "Reset Your Password",
        getHtmlContent: (data: EmailData) => {
          const otpData = data as OtpEmailData;
          return `
          <p>Hello,</p>
          <p>We received a request to reset your password for your <strong>${this.appName}</strong> account.</p>
          <p>Use the verification code below to reset your password:</p>
          <div class="otp-container">
            <div class="otp-label">Password Reset Code</div>
            <div class="otp">${otpData.otp}</div>
            <div class="otp-expiry">⏱️ This code expires in ${otpData.expiryTime}</div>
          </div>
          <div class="warning-box">
            <p><strong>⚠️ Didn't request this?</strong> If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
          </div>
        `;
        },
        getTextContent: (data: EmailData) => {
          const otpData = data as OtpEmailData;
          return `
          Reset Your Password
          
          Use this code to reset your password: ${otpData.otp}
          This code expires in ${otpData.expiryTime}.
          
          Best regards,
          The ${this.appName} Team
        `;
        },
      },

      [EmailType.VERIFICATION_SUCCESS]: {
        subject: "Application Approved!",
        getHtmlContent: (data: EmailData) => {
          const approvalData = data as TechnicianApprovalData;
          return `
          <div class="success-icon">✓</div>
          <p style="font-size: 18px; text-align: center; color: #333; margin-bottom: 25px;">
            <strong>Congratulations, ${approvalData.technicianName}! 🎉</strong>
          </p>
          <p>We're thrilled to inform you that your technician application has been <strong style="color: #28a745;">approved</strong>!</p>
          <p>You're now officially part of the <strong>${this.appName}</strong> family. You can start receiving service requests and grow your business with us.</p>
          <div class="info-box">
            <p><strong>What's Next?</strong></p>
            <p style="margin-top: 10px;">• Access your technician dashboard</p>
            <p>• Complete your profile setup</p>
            <p>• Start accepting service requests</p>
          </div>
          <p style="margin-top: 30px;">We're here to support you every step of the way. Welcome aboard!</p>
        `;
        },
        getTextContent: (data: EmailData) => {
          const approvalData = data as TechnicianApprovalData;
          return `
          Application Approved!
          
          Dear ${approvalData.technicianName},
          
          Congratulations! Your technician application has been approved.
          You can now access your dashboard and start receiving service requests.
          
          Best regards,
          The ${this.appName} Team
        `;
        },
      },

      [EmailType.APPLICATION_REJECTED]: {
        subject: "Application Update",
        getHtmlContent: (data: EmailData) => {
          const rejectionData = data as TechnicianRejectionData;
          return `
      <p>Dear ${rejectionData.technicianName},</p>
      <p>Thank you for your interest in joining <strong>${this.appName}</strong> as a technician. We truly appreciate the time and effort you invested in your application.</p>
      <p>After careful review, we regret to inform you that we cannot approve your application at this time.</p>
      ${
        rejectionData.reason
          ? `<div class="info-box">
          <p><strong>Reason for Decision:</strong></p>
          <p style="margin-top: 10px;">${rejectionData.reason}</p>
        </div>`
          : ""
      }
      <p>We encourage you to reapply in the future when you meet our requirements. We're always looking for talented professionals to join our platform.</p>
      <div class="info-box">
        <p><strong>Need Help?</strong></p>
        <p style="margin-top: 10px;">If you have questions about this decision or would like guidance on how to strengthen your application, please don't hesitate to contact our support team.</p>
      </div>
      <p style="margin-top: 25px;">Thank you again for considering <strong>${this.appName}</strong>. We wish you all the best in your professional endeavors.</p>
    `;
        },
        getTextContent: (data: EmailData) => {
          const rejectionData = data as TechnicianRejectionData;
          return `
      Application Update
      
      Dear ${rejectionData.technicianName},
      
      Thank you for your interest in joining Fixify as a technician.
      Unfortunately, we cannot approve your application at this time.
      ${rejectionData.reason ? `\nReason: ${rejectionData.reason}` : ""}
      
      You're welcome to reapply in the future when you meet our requirements.
      
      Best regards,
      The ${this.appName} Team
    `;
        },
      },
    };
  }
}