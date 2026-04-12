import https from 'https';

const TELLER_API = 'https://api.teller.io';

let agentInstance: https.Agent | null = null;

function getTellerAgent(): https.Agent {
  if (agentInstance) return agentInstance;

  const certB64 = process.env.TELLER_CERT;
  const keyB64 = process.env.TELLER_KEY;

  if (!certB64 || !keyB64) {
    throw new Error('TELLER_CERT and TELLER_KEY environment variables are required');
  }

  agentInstance = new https.Agent({
    cert: Buffer.from(certB64, 'base64'),
    key: Buffer.from(keyB64, 'base64'),
  });

  return agentInstance;
}

export async function tellerFetch(path: string, accessToken: string): Promise<Response> {
  const agent = getTellerAgent();
  const url = `${TELLER_API}${path}`;

  // Node 18+ fetch supports a dispatcher option, but for mTLS we need
  // to use the undici agent or node:https. We'll use undici's fetch with agent.
  // Vercel serverless uses Node 18+ which supports passing an agent via the
  // internal undici dispatcher. However, the simplest cross-compatible approach
  // is to use node-fetch or a manual https request.

  return new Promise((resolve, reject) => {
    const authHeader = 'Basic ' + Buffer.from(`${accessToken}:`).toString('base64');

    const req = https.request(url, {
      method: 'GET',
      agent,
      headers: {
        'Authorization': authHeader,
      },
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        resolve(new Response(body, {
          status: res.statusCode || 500,
          headers: Object.fromEntries(
            Object.entries(res.headers).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
          ),
        }));
      });
    });

    req.on('error', reject);
    req.end();
  });
}
