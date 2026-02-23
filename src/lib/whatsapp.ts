import axios from 'axios';
import { logger } from './logger';

const WA_API_URL = 'https://graph.facebook.com/v18.0';

interface WASendTemplateParams {
  phoneNumberId: string;
  accessToken: string;
  to: string; // E.164 format: +91XXXXXXXXXX
  templateName: string;
  languageCode?: string;
  components?: object[];
}

interface WASendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendWhatsAppTemplate(
  params: WASendTemplateParams,
  userId?: string
): Promise<WASendResult> {
  const { phoneNumberId, accessToken, to, templateName, languageCode = 'en', components = [] } = params;

  try {
    const response = await axios.post(
      `${WA_API_URL}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const messageId = response.data?.messages?.[0]?.id;
    await logger.info('WhatsApp', `Message sent to ${to}`, { messageId, templateName }, userId);
    return { success: true, messageId };
  } catch (err: unknown) {
    const error = err as { response?: { data?: unknown }; message?: string };
    const errorMsg = JSON.stringify(error.response?.data || error.message);
    await logger.error('WhatsApp', `Failed to send to ${to}`, { error: errorMsg, templateName }, userId);
    return { success: false, error: errorMsg };
  }
}

// Build WhatsApp follow-up template components
export function buildFollowUpComponents(leadName: string, productName: string, shopName: string) {
  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: leadName },
        { type: 'text', text: productName },
        { type: 'text', text: shopName },
      ],
    },
  ];
}

// Build daily summary template components
export function buildSummaryComponents(
  totalLeads: number,
  newLeads: number,
  converted: number,
  shopName: string
) {
  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: shopName },
        { type: 'text', text: String(newLeads) },
        { type: 'text', text: String(totalLeads) },
        { type: 'text', text: String(converted) },
      ],
    },
  ];
}

// Send owner alert when new lead arrives
export async function sendOwnerAlert(
  phoneNumberId: string,
  accessToken: string,
  ownerPhone: string,
  leadName: string,
  leadPhone: string,
  productName: string,
  userId: string
) {
  return sendWhatsAppTemplate(
    {
      phoneNumberId,
      accessToken,
      to: `91${ownerPhone.replace(/\D/g, '')}`,
      templateName: process.env.WA_TEMPLATE_FOLLOWUP!,
      components: buildFollowUpComponents(leadName, productName, 'Your Shop'),
    },
    userId
  );
}
