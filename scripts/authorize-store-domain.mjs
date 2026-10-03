import { googleApi } from './firebase-client.mjs';

const domain = process.argv[2];
if (!domain || !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain)) {
  throw new Error('Provide an exact store hostname, without a scheme or path.');
}
const hostname = domain.toLowerCase();
const authUrl = 'https://identitytoolkit.googleapis.com/admin/v2/projects/muanoluxe/config';
const config = await googleApi(authUrl);
const authorizedDomains = [...new Set([...(config.authorizedDomains || []), hostname])];
await googleApi(`${authUrl}?updateMask=authorizedDomains`, 'PATCH', { authorizedDomains });

const keys = await googleApi('https://recaptchaenterprise.googleapis.com/v1/projects/muanoluxe/keys');
const key = keys.keys?.find(k => k.displayName === 'MuanoLuxe storefront App Check');
if (!key) throw new Error('The production App Check key was not found.');
const allowedDomains = [...new Set([...(key.webSettings.allowedDomains || []), hostname])];
await googleApi(`https://recaptchaenterprise.googleapis.com/v1/${key.name}?updateMask=webSettings.allowedDomains`, 'PATCH', {
  name: key.name,
  webSettings: { allowedDomains },
});

const updatedAuth = await googleApi(authUrl);
const updatedKey = await googleApi(`https://recaptchaenterprise.googleapis.com/v1/${key.name}`);
if (!updatedAuth.authorizedDomains?.includes(hostname) || !updatedKey.webSettings?.allowedDomains?.includes(hostname)) {
  throw new Error('Domain verification failed.');
}
console.log(`Verified Firebase Authentication and App Check authorization for ${hostname}.`);
