import { EmailType } from "../../constants/emailTypes.js";
import {
  type EmailContentResult,
  type EmailData,
} from "../../services/emailTemplate.service.js";

export interface IemailTemplateService {
  generateEmailContent(type: EmailType, data: EmailData): EmailContentResult;
}
