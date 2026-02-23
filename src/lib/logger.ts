import { prisma } from './prisma';
import { LogLevel } from '@prisma/client';
import axios from 'axios';

type LogMeta = Record<string, unknown>;

async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ALERT_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: `🚨 JewelLead Alert\n\n${message}`,
      parse_mode: 'Markdown',
    });
  } catch {
    console.error('Failed to send Telegram alert');
  }
}

export const logger = {
  async info(source: string, message: string, meta?: LogMeta, userId?: string) {
    console.log(`[INFO] [${source}] ${message}`, meta || '');
    try {
      await prisma.systemLog.create({
        data: { userId, level: LogLevel.INFO, source, message, meta: meta as object },
      });
    } catch {}
  },

  async warn(source: string, message: string, meta?: LogMeta, userId?: string) {
    console.warn(`[WARN] [${source}] ${message}`, meta || '');
    try {
      await prisma.systemLog.create({
        data: { userId, level: LogLevel.WARN, source, message, meta: meta as object },
      });
    } catch {}
  },

  async error(source: string, message: string, meta?: LogMeta, userId?: string) {
    console.error(`[ERROR] [${source}] ${message}`, meta || '');
    try {
      await prisma.systemLog.create({
        data: { userId, level: LogLevel.ERROR, source, message, meta: meta as object },
      });
      await sendTelegramAlert(`*[ERROR]* [${source}]\n${message}`);
    } catch {}
  },

  async critical(source: string, message: string, meta?: LogMeta, userId?: string) {
    console.error(`[CRITICAL] [${source}] ${message}`, meta || '');
    try {
      await prisma.systemLog.create({
        data: { userId, level: LogLevel.CRITICAL, source, message, meta: meta as object },
      });
      await sendTelegramAlert(`*🔴 [CRITICAL]* [${source}]\n${message}`);
    } catch {}
  },
};
