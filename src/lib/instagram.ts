import axios from 'axios';
import { logger } from './logger';

const IG_API_URL = 'https://graph.facebook.com/v18.0';

interface SendDMParams {
  recipientId: string;
  message: string;
  accessToken: string;
  igUserId: string;
}

export async function sendInstagramDM(params: SendDMParams, userId?: string) {
  const { recipientId, message, accessToken, igUserId } = params;

  try {
    const response = await axios.post(
      `${IG_API_URL}/${igUserId}/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    await logger.info('Instagram', `DM sent to ${recipientId}`, {}, userId);
    return { success: true, data: response.data };
  } catch (err: unknown) {
    const error = err as { response?: { data?: unknown }; message?: string };
    const errorMsg = JSON.stringify(error.response?.data || error.message);
    await logger.error('Instagram', `DM failed to ${recipientId}`, { error: errorMsg }, userId);
    return { success: false, error: errorMsg };
  }
}

export function buildLeadFormDM(formUrl: string, productName: string): string {
  return (
    `Hi! 👋 Thanks for your interest in *${productName}*.\n\n` +
    `Please fill this quick form so we can help you better:\n🔗 ${formUrl}\n\n` +
    `It only takes 30 seconds! 💍`
  );
}

export function matchesTriggerWord(comment: string, triggerWord: string): boolean {
  const normalized = comment.toLowerCase().trim();
  const trigger = triggerWord.toLowerCase().trim();
  return normalized.includes(trigger);
}
