import { CampaignType } from '@prisma/client';

export interface CampaignTemplate {
  type: CampaignType;
  name: string;
  emoji: string;
  description: string;
  preview: string;
  templateName: string; // WA pre-approved template name
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    type: 'FESTIVAL_OFFER',
    name: 'Festival Offer',
    emoji: '🎉',
    description: 'Share exclusive festival discounts with all your leads',
    preview: 'This festive season, enjoy special offers on our jewelry collection. Limited time only!',
    templateName: 'jewellead_festival_offer',
  },
  {
    type: 'BRIDAL_OFFER',
    name: 'Bridal Offer',
    emoji: '💍',
    description: 'Target potential brides with special bridal jewelry packages',
    preview: 'Complete your bridal look with our exclusive bridal jewelry set. Book a consultation today!',
    templateName: 'jewellead_bridal_offer',
  },
  {
    type: 'GOLD_RATE_DROP',
    name: 'Gold Rate Drop Alert',
    emoji: '📉',
    description: "Alert customers when gold rate drops — perfect buying time",
    preview: "Gold rates have dropped today! This is the best time to buy. Visit us or WhatsApp now.",
    templateName: 'jewellead_gold_rate_drop',
  },
  {
    type: 'NEW_COLLECTION',
    name: 'New Collection',
    emoji: '✨',
    description: 'Announce your latest jewelry designs to all leads',
    preview: "We've just launched our new collection! Be the first to explore stunning new designs.",
    templateName: 'jewellead_new_collection',
  },
];

export function getTemplate(type: CampaignType): CampaignTemplate | undefined {
  return CAMPAIGN_TEMPLATES.find((t) => t.type === type);
}
