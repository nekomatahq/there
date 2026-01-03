import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';

const TRACKING_PARAMS = new Set([
  // UTM parameters
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'utm_cid',
  // Facebook
  'fbclid',
  'fb_action_ids',
  'fb_action_types',
  'fb_source',
  'fb_ref',
  // Google
  'gclid',
  'gclsrc',
  'dclid',
  '_ga',
  '_gl',
  '_gac',
  // Microsoft/Bing
  'msclkid',
  // Twitter
  'twclid',
  // Instagram
  'igshid',
  // TikTok
  'ttclid',
  // Mailchimp
  'mc_eid',
  'mc_cid',
  // HubSpot
  '_hsenc',
  '_hsmi',
  'hsCtaTracking',
  // Generic
  'ref',
  'ref_src',
  'ref_url',
  'source',
  'campaign',
  // Yahoo
  'yclid',
  // Affiliate
  'aff',
  'affiliate',
  'affiliate_id',
  // Session/tracking
  's_kwcid',
  'trk',
  'tracking',
]);

function stripTrackingParams(url: URL): URL {
  const cleaned = new URL(url.toString());
  const paramsToDelete: string[] = [];

  cleaned.searchParams.forEach((_, key) => {
    const lowerKey = key.toLowerCase();
    if (
      TRACKING_PARAMS.has(lowerKey) ||
      lowerKey.startsWith('utm_') ||
      lowerKey.startsWith('fb_') ||
      lowerKey.startsWith('mc_') ||
      lowerKey.startsWith('_hs')
    ) {
      paramsToDelete.push(key);
    }
  });

  paramsToDelete.forEach((key) => cleaned.searchParams.delete(key));

  return cleaned;
}

export const thereRouter = createTRPCRouter({
  clean: baseProcedure
    .input(
      z.object({
        url: z.string().min(1, 'URL is required'),
      })
    )
    .mutation(async ({ input }) => {
      let url: URL;

      // Parse and validate URL
      try {
        let rawUrl = input.url.trim();
        if (!/^https?:\/\//i.test(rawUrl)) {
          rawUrl = 'https://' + rawUrl;
        }
        url = new URL(rawUrl);
      } catch {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "That doesn't look like a valid URL.",
        });
      }

      // Follow redirects
      try {
        const response = await fetch(url.toString(), {
          method: 'HEAD',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; URLCleaner/1.0)',
          },
        });

        if (response.url) {
          url = new URL(response.url);
        }
      } catch {
        // Network error - continue with original URL
        // Some URLs may not be reachable but still valid
      }

      // Strip tracking parameters
      const cleaned = stripTrackingParams(url);

      return {
        url: cleaned.toString(),
      };
    }),
});
