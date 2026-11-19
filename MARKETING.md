# DrawSanta launch plan (Nov 18 to Dec 18)

Live: https://cersuna.github.io/secret-santa-generator/

## How it makes money
1. **Amazon affiliate links** (main source). Every participant who opens a reveal link lands on budget-matched gift ideas, so each organizer sends us 5 to 30 shoppers. Amazon pays roughly 3–4.5% on everything in the cart for 24h, not only the item clicked.
2. **Tip button** (Stripe Payment Link / Ko-fi). Expect 0.1–0.5% of organizers.
3. **AdSense** (optional; approval usually takes 1–3 weeks, so apply now or skip it).

## Day 1 checklist (about 45 minutes, needs your accounts)
- [ ] **Amazon Associates**: sign up at affiliate-program.amazon.com and list the site URL. Put the tracking ID in `src/config.mjs` → `amazonTag`. (You need 3 qualifying sales within 180 days to stay approved.)
- [ ] **Tip link**: Stripe → Payment Links → "Pay what you want", or Ko-fi. Put it in `supportUrl`.
- [ ] **Custom domain (strongly recommended, ~$10)**: e.g. drawsanta.com / drawsanta.app. Point it at GitHub Pages, set `siteUrl` in config, rebuild. A domain ranks better and looks more trustworthy when shared.
- [ ] **Google Search Console**: add the property, verify it, submit `/sitemap.xml`, and use "Request indexing" on the home page and the 4 gift pages.
- [ ] **Bing Webmaster Tools**: import from Search Console (Bing powers DuckDuckGo and ChatGPT search).
- [ ] **GA4**: create a property, put the ID in `ga4Id`. Events are already wired: `draw_complete`, `link_copied`, `reveal_open`, `gift_click`.
- [ ] Run `npm run build`, then commit and push.

## Distribution (the generator spreads itself; these posts get it started)
Rules: post as yourself, be upfront that you built it, follow each community's self-promo rules.

**Reddit** (r/SideProject, r/InternetIsBeautiful, r/webdev on Showoff Saturday, r/Christmas, r/secretsanta, r/AskHR & r/managers only where self-promo is allowed)
> **I built a free Secret Santa generator with no sign-up and no email collection**
> Every Secret Santa site I tried wanted everyone's email or an account. So I made one where you paste names, add exclusions (couples, etc.), and get a private link for each person to drop into the group chat. Everything runs in the browser and nothing is stored on a server. Feedback welcome! https://cersuna.github.io/secret-santa-generator/

**Product Hunt / Hacker News (Show HN)**
> Show HN: A Secret Santa generator with no accounts. The draw lives in the URL fragment.
> The assignment is encoded in each person's link after the `#`, so it never reaches a server and there's no database. Exclusions use randomized backtracking.

**Facebook / Nextdoor / local groups / family group chat**
> Doing Secret Santa this year? I made a free tool: type everyone's names in, it texts each person a private link saying who they're buying for. No apps, no sign-ups 🎅 [link]

**TikTok / Reels / Shorts (15s screen recording)**: "POV: you're the one organizing Secret Santa this year" → paste names → draw → friend opens the link → gift box pops → confetti. Caption: "free, no sign-up, link in bio". Post 3–5 variants (office, family, long-distance).

**Pinterest** (major for gift searches): one pin per gift-idea page ("Secret Santa gifts under $20") linking to that page. Pinterest traffic peaks in early December.

**Slack/Discord communities & your workplace**: offer to run your office exchange with it. Every organizer becomes a channel.

## SEO already in place
- 12 indexable pages aimed at high-volume December queries: *secret santa generator*, *secret santa gift ideas under $10/20/25/50*, *secret santa rules*, *secret santa questionnaire*, *white elephant rules*, *office/virtual secret santa*
- Titles and meta descriptions, canonical tags, Open Graph image, sitemap.xml, FAQPage + WebApplication + Breadcrumb JSON-LD, internal linking, mobile-first, no frameworks (fast)
- Reveal pages are `noindex`

## Realistic expectations
New sites rarely rank for *secret santa generator* within 4 weeks; that query is very competitive. The long-tail gift pages and **word of mouth through the reveal links** are the realistic December channels. Plan to keep the site live, because it compounds: next November the pages will have age and backlinks.
