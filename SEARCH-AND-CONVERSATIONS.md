# Search branding, conversations and phone sign-up

## Search appearance

The production build includes MuanoLuxe WebSite/Organization structured data,
the owner-supplied logo as a favicon, canonical URLs, social preview metadata,
and crawlable `/collection/`, `/about/` and `/contact/` pages. These pages are
linked from the storefront and included in `/sitemap.xml`.

After deploying to the repository connected to muanoluxe.com, verify the domain
in Google Search Console, submit `https://muanoluxe.com/sitemap.xml`, and request
indexing of the home page. Google chooses the title, snippet, logo presentation
and sitelinks; the exact example layout cannot be forced or guaranteed.

References: [site names](https://developers.google.com/search/docs/appearance/site-names),
[sitelinks](https://developers.google.com/search/docs/appearance/sitelinks),
[favicons](https://developers.google.com/search/docs/appearance/favicon-in-search).

## Conversations

Studio now has a Conversations section. New AI-assistant sessions are stored in
Firestore `conversations/{id}` with paired customer/assistant turns in the
`messages` subcollection. Server timestamps and authenticated account IDs (when
present) are recorded. Guest sessions use a random session token whose hash is
the document ID. Conversation history used by Gemini comes from the server,
not client-supplied history. Retried message IDs return the stored reply.

Admins can load older conversations and earlier turns. Failed replies are
recorded as failed, preserving the customer's message. Customers cannot read
the transcript collections or write forged replies directly. Chat and privacy
notices explain staff review. No password, SMS code or payment credential is
requested by the assistant. Restrict administrator access to trusted staff.

History begins after deploying the updated shoppingAssistant function. Previous
unsaved conversations cannot be recovered. Emails, WhatsApp and other external
channels are not captured. Transcripts remain until an administrator removes
them through Firebase; for deletion requests, remove both the conversation
document and its messages subcollection.

## Phone numbers

Local South African input (082 123 4567 or 821234567) is normalized to
+27821234567. Existing +27, 27 and 0027 forms are supported, along with other
international numbers beginning with + or 00. Invalid/incomplete input is
rejected before requesting an SMS. Firebase SMS verification still applies.

## Deployment

Build with `npm run build`, then deploy hosting, Firestore rules and the
shoppingAssistant function together. Cloudflare needs the same frontend commit
and build command to serve the new brand pages on the canonical domain.

These changes are prepared locally; this document does not confirm publication
or Google indexing. Do not deploy only the frontend: the backend and rules are
required for conversation history.
