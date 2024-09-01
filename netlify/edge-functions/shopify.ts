import type { Context, Config } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  console.log('in /shopify', request);
  
  const url = Netlify.env.get("PUBLIC_SHOPIFY_STOREFRONT_URL");
  const token = Netlify.env.get("PUBLIC_SHOPIFY_STOREFRONT_TOKEN")
  const rsp = await fetch(url, {
    body: request.body,
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
      'Shopify-Storefront-Buyer-IP': context.ip,
    }
  });
  const jsonData = await rsp.json();
  return Response.json(jsonData);
};

export const config: Config = {
  path: "/shopify",
};