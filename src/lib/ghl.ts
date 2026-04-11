/**
 * GoHighLevel contact upsert + workflow enrollment.
 *
 * Called from the Stripe webhook after checkout.session.completed.
 *
 * Required env vars (set in Vercel per app):
 *   GHL_API_KEY                 — Private Integration API key ("pit-...")
 *   GHL_LOCATION_ID             — Salisbury Bookkeeping location ID
 *   GHL_TAG_APP                 — per-app tag (e.g. "memori-ai")
 *   GHL_SHORT_DRIP_WORKFLOW_ID  — short drip workflow id for this app
 *   GHL_LONG_DRIP_WORKFLOW_ID   — long drip workflow id for this app
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

export interface GhlEnrollParams {
  email: string;
  firstName?: string;
  lastName?: string;
  priceId?: string;
  stripeCustomerId?: string;
  metadata?: Record<string, string>;
}

async function ghlRequest(method: string, path: string, body?: unknown) {
  const key = process.env.GHL_API_KEY;
  if (!key) {
    console.warn('[ghl] GHL_API_KEY missing — skipping');
    return { ok: false, skipped: true } as const;
  }
  const res = await fetch(GHL_BASE + path, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Version: GHL_VERSION,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`[ghl] ${method} ${path} failed:`, res.status, text);
    return { ok: false, status: res.status, body: text } as const;
  }
  return { ok: true, data: await res.json() } as const;
}

export async function enrollInGhl(params: GhlEnrollParams) {
  const locationId = process.env.GHL_LOCATION_ID;
  if (!locationId) {
    console.warn('[ghl] GHL_LOCATION_ID missing — skipping');
    return;
  }
  const appTag = process.env.GHL_TAG_APP || 'unknown-app';
  const shortWfId = process.env.GHL_SHORT_DRIP_WORKFLOW_ID;
  const longWfId = process.env.GHL_LONG_DRIP_WORKFLOW_ID;

  const upsert = await ghlRequest('POST', '/contacts/upsert', {
    locationId,
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
    source: appTag,
    tags: ['customer', appTag, params.priceId || 'unknown-price'].filter(Boolean),
    customFields: Object.entries(params.metadata || {}).map(([key, value]) => ({ key, field_value: value })),
  });

  if (!upsert.ok || !(upsert as any).data?.contact?.id) {
    console.error('[ghl] upsert failed; skipping workflow enrollment');
    return;
  }
  const contactId = (upsert as any).data.contact.id;

  if (shortWfId) {
    await ghlRequest('POST', `/contacts/${contactId}/workflow/${shortWfId}`, {
      eventStartTime: new Date().toISOString(),
    });
  } else {
    console.warn('[ghl] GHL_SHORT_DRIP_WORKFLOW_ID not set — short drip skipped');
  }
  if (longWfId) {
    await ghlRequest('POST', `/contacts/${contactId}/workflow/${longWfId}`, {
      eventStartTime: new Date().toISOString(),
    });
  } else {
    console.warn('[ghl] GHL_LONG_DRIP_WORKFLOW_ID not set — long drip skipped');
  }
}
