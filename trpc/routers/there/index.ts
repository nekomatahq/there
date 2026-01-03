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
  // Google DoubleClick
  'gdfms',
  'gdftrk',
  'gdffi',
  // Adobe
  '_bta_tid',
  '_bta_c',
  // Klaviyo
  '_ke',
  '_kx',
  // Microsoft/Bing
  'msclkid',
  // Twitter
  'twclid',
  // Instagram
  'igsh',
  'igshid',
  'si',
  // TikTok
  'ttclid',
  // YouTube
  'feature',
  // Mailchimp
  'mc_eid',
  'mc_cid',
  // HubSpot
  '__hsfp',
  '__hssc',
  '__hstc',
  '_hsenc',
  '_hsmi',
  'hsCtaTracking',
  'h_sid',
  'h_slt',
  // Generic
  'ref',
  'ref_src',
  'ref_url',
  'source',
  'campaign',
  'campaign_id',
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
  // Branch
  '_branch_match_id',
  '_branch_referrer',
  'mkevt',
  'mkcid',
  'mkrid',
  'campid',
  'toolid',
  'customid',
  // Other tracking
  'sb_referer_host',
  'mkwid',
  'pcrid',
  'ef_id',
  'dm_i',
  'epik',
  'hootpostid',
  'wprov',
  '__s',
  'wt.mc_id',
  'wt.nav',
  // Additional tracking parameters
  '_bhlid',
  '_openstat',
  '_z1_agid',
  '_z1_caid',
  '_z1_msid',
  '_z1_pub',
  'ad_id',
  'adobe_mc_ref',
  'adobe_mc_sdid',
  'afid',
  'ao_noptimize',
  'at_recipient_id',
  'at_recipient_list',
  'auctid',
  'awclid',
  'bbeml',
  'bsft_clkid',
  'bsft_uid',
  'cid',
  'cjdata',
  'cjevent',
  'ck_subscriber_id',
  'clickid',
  'cn_reloaded',
  'ct_params',
  'cvid',
  'dicbo',
  'eid',
  'et_rid',
  'gci',
  'guce_referrer_sig',
  'guce_referrer',
  'icid',
  'irclickid',
  'li_fat_id',
  'mkt_tok',
  'ml_subscriber_hash',
  'ml_subscriber',
  'mtm_cid',
  'oft_c',
  'oft_campaign',
  'oft_ck',
  'oft_d',
  'oft_id',
  'oft_ids',
  'oft_k',
  'oft_lk',
  'oft_sk',
  'oicd',
  'oly_anon_id',
  'oly_enc_id',
  'omnisendContactID',
  'otc',
  'pk_cid',
  'qclid',
  'rb_clickid',
  'rdt_cid',
  's_cid',
  'sc_customer',
  'sc_eh',
  'sc_uid',
  'sccid',
  'soc_src',
  'soc_trk',
  'ss_email_id',
  'shareasale',
  'subafid',
  'tblci',
  'tduid',
  'unicorn_click_id',
  'vero_conv',
  'vero_id',
  'vgo_ee',
  'vmcid',
  'wickedid',
  'ymclid',
  'ysclid',
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
      lowerKey.startsWith('_hs') ||
      lowerKey.startsWith('trk_') ||
      lowerKey.startsWith('pk_') ||
      lowerKey.startsWith('piwik_') ||
      lowerKey.startsWith('mtm_') ||
      lowerKey.startsWith('matomo_') ||
      lowerKey.startsWith('hsa_') ||
      lowerKey.startsWith('igsh') ||
      lowerKey.startsWith('sms_')
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
