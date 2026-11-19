export function pages({ base, config, esc, ideaCards, faqBlock, supportBlock, year }) {
  const S = config.siteName;
  const cta = (text = "Draw names free now →", q = "") =>
    `<p class="center" style="margin:28px 0"><a class="btn primary" href="${base}/${q}">${text}</a></p>`;
  const crumbs = (name, path) => ({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Secret Santa Generator", item: config.siteUrl + "/" },
      { "@type": "ListItem", position: 2, name, item: config.siteUrl + path },
    ],
  });

  // ================= HOME / GENERATOR =================
  const homeFaq = faqBlock([
    ["Is this Secret Santa generator really free?", `Yes. ${S} is 100% free with no sign-up, no email addresses and no limit on how many people you add. Optional gift-idea links earn us a small affiliate commission at no cost to you.`],
    ["How does everyone find out who they got?", "After the draw, every participant gets their own private link. Send each person their link by text, WhatsApp, email or Slack. When they open it, they unwrap a gift box that shows who they're buying for, along with that person's wishlist and the budget."],
    ["Will the organizer see who got who?", "No. The organizer only sees a list of names with a link next to each one, never the matches. That means the organizer can join in too. (Just don't open other people's links!)"],
    ["Can I stop couples or family members from drawing each other?", "Yes. Use <b>Exclusions</b> to stop specific people from drawing each other, either one-way or both ways. The generator also avoids two people drawing each other by default."],
    ["Do you store our names?", "No. The draw runs entirely in your browser. Names live only in your browser and inside each private link. Nothing is uploaded to a server and no database exists."],
    ["What if someone loses their link?", "The organizer's browser remembers the draw, so reopen this page on the same device and the links will still be there to copy again."],
    ["Can I use it for an office or virtual Secret Santa?", `Absolutely. Because links can go through any messenger, ${S} works for office parties, remote teams, families spread across the country, classrooms and friend groups.`],
    ["How many people can join?", "There's no hard limit. Groups of 3 to 100+ work fine."],
  ]);

  const home = {
    path: "/",
    priority: 1.0,
    title: `Free Secret Santa Generator: Draw Names Online, No Sign-Up (${year})`,
    description: "Draw names for Secret Santa in seconds. Free, no emails or sign-up needed. Add exclusions, a budget and wishlists, then send everyone a private reveal link by text, WhatsApp or email.",
    schema: [
      homeFaq.schema,
      { "@context": "https://schema.org", "@type": "WebApplication", name: `${S} Secret Santa Generator`, url: config.siteUrl + "/", applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    ],
    scripts: ["codec.js", "app.js"],
    body: `
<section class="hero">
  <h1>Free Secret Santa Generator</h1>
  <p>Draw names in 30 seconds. No sign-up, no emails. Everyone gets a private link that reveals who they're buying for.</p>
  <div class="badges"><span class="badge">✓ No account</span><span class="badge">✓ Exclusions</span><span class="badge">✓ Wishlists</span><span class="badge">✓ Text / WhatsApp / Email</span></div>
</section>

<div class="card" id="tool">
  <h2>1. Who's taking part? <span class="muted small" id="count"></span></h2>
  <div id="people"></div>
  <p><button type="button" class="btn small" id="addPerson">+ Add person</button> <button type="button" class="btn small ghost" id="bulkBtn">Paste a list</button></p>

  <h2 style="margin-top:24px">2. Exchange details <span class="muted small">(optional)</span></h2>
  <div class="grid">
    <div><label for="evName">Event name</label><input id="evName" placeholder="Smith Family Christmas" maxlength="60"></div>
    <div><label for="budget">Budget</label><div class="row" style="margin:0"><select id="currency" style="width:80px" aria-label="Currency"><option>$</option><option>£</option><option>€</option><option>C$</option><option>A$</option><option>₹</option></select><input id="budget" inputmode="decimal" placeholder="25" maxlength="8"></div></div>
    <div><label for="evDate">Exchange date</label><input id="evDate" type="date"></div>
  </div>
  <div style="margin-top:12px"><label for="note">Message to everyone</label><input id="note" placeholder="Bring gifts wrapped to the party at 7pm!" maxlength="160"></div>

  <h2 style="margin-top:24px">3. Exclusions <span class="muted small">(optional)</span></h2>
  <p class="muted small" style="margin-top:-8px">Stop couples, roommates or last year's pairs from drawing each other.</p>
  <div class="row"><select id="exA" aria-label="Person"></select><span>can't draw</span><select id="exB" aria-label="Excluded person"></select></div>
  <div class="row"><label class="check"><input type="checkbox" id="exBoth" checked> Both ways</label><button type="button" class="btn small" id="exAdd">Add rule</button></div>
  <div class="chips" id="exList"></div>
  <p><label class="check"><input type="checkbox" id="noPairs" checked> Don't let two people draw each other</label></p>

  <p class="center" style="margin-top:20px"><button type="button" class="btn primary" id="drawBtn">🎲 Draw names</button></p>
  <div class="err" id="err" role="alert"></div>
</div>

<div class="card hidden results" id="results">
  <h2>🎉 Names drawn! Send each person their private link</h2>
  <p class="muted small">You can't see who got who, so you can join in too. Only open your <b>own</b> link.</p>
  <ul id="resList"></ul>
  <p style="margin-top:16px"><button class="btn small" id="copyAll">Copy all links</button> <button class="btn small ghost" id="resetBtn">Start a new exchange</button></p>
</div>

${supportBlock()}

<article>
<h2>How to draw names for Secret Santa online</h2>
<ol>
<li><b>Add everyone's names.</b> Type them in, or paste a whole list from a group chat. You can add a wishlist or hints for each person.</li>
<li><b>Set the budget and date.</b> These appear on every reveal so nobody forgets the spending limit.</li>
<li><b>Add exclusions</b> so partners or housemates can't draw each other.</li>
<li><b>Click "Draw names"</b>, then send each person their private link by text, WhatsApp, email, Slack or Teams.</li>
<li>Each person <b>taps the gift box</b> to unwrap their match and gets gift ideas that fit the budget.</li>
</ol>

<h2>Why use ${S} instead of drawing from a hat?</h2>
<p>Pulling names from a hat only works if everyone is in the same room, and someone always draws their own name. An online Secret Santa generator fixes both problems. The draw is random, nobody gets themselves, and it works for families, offices and friends spread across different cities. Unlike most Secret Santa sites, ${S} doesn't make you create an account or collect everyone's email address. The links do the work.</p>

<h2>Popular Secret Santa budgets</h2>
<p>Most groups pick one of these limits. Click one for gift ideas that fit it:</p>
<ul>
<li><a href="${base}/secret-santa-gift-ideas-under-10/">Secret Santa gifts under $10</a>: classrooms, big offices</li>
<li><a href="${base}/secret-santa-gift-ideas-under-20/">Secret Santa gifts under $20</a>: the most popular office budget</li>
<li><a href="${base}/secret-santa-gift-ideas-under-25/">Secret Santa gifts under $25</a>: friend groups</li>
<li><a href="${base}/secret-santa-gift-ideas-under-50/">Secret Santa gifts under $50</a>: families and close friends</li>
</ul>
<p>New to it? Read the <a href="${base}/secret-santa-rules/">Secret Santa rules</a>, print a <a href="${base}/secret-santa-questionnaire/">Secret Santa questionnaire</a>, or see how to run an <a href="${base}/office-secret-santa/">office Secret Santa</a> or a <a href="${base}/virtual-secret-santa/">virtual Secret Santa</a>.</p>

${homeFaq.html}
</article>`,
  };

  // ================= REVEAL =================
  const reveal = {
    path: "/reveal/",
    noindex: true,
    title: `Your Secret Santa match 🎁 | ${S}`,
    description: "Open your private Secret Santa link to see who you're buying a gift for.",
    scripts: ["codec.js", "gifts.js", "reveal.js"],
    body: `
<div id="bad" class="card center hidden" style="margin-top:40px">
  <h1>Hmm, this link looks broken 🤔</h1>
  <p class="muted">Make sure you copied the whole link, including everything after the <code>#</code>. Ask your organizer to send it again.</p>
  <a class="btn primary" href="${base}/">Organize your own Secret Santa</a>
</div>
<div id="good" class="center">
  <section class="hero" style="padding-bottom:0">
    <h1 id="hello">Hi!</h1>
    <p id="evLine">Your Secret Santa match is inside.</p>
  </section>
  <div class="facts" id="facts"></div>
  <div class="gift" id="gift" role="button" tabindex="0" aria-label="Open your gift to reveal your match">
    <div class="bow">🎀</div><div class="lid"></div><div class="box"></div><div class="rib-v"></div>
  </div>
  <p id="tap" class="muted"><b>Tap the gift to unwrap your match.</b><br><span class="small">Make sure nobody's looking over your shoulder 👀</span></p>
  <div id="result" class="hidden">
    <p class="muted" style="margin-bottom:0">You're the Secret Santa for…</p>
    <div class="reveal-name" id="rName"></div>
    <div id="wishBox" class="card hidden" style="max-width:520px;margin:12px auto;text-align:left"><b>🎄 Their wishlist / hints</b><p id="rWish" style="margin:6px 0 0"></p></div>
    <p class="muted small">Shh! 🤫 Keep it secret. Screenshot this page so you don't forget.</p>
    <p id="note" class="hidden"></p>
  </div>
</div>
<div id="after" class="hidden">
  <div class="card">
    <h2 id="ideasTitle">Gift ideas</h2>
    <p class="muted small" style="margin-top:-6px">Popular picks that fit your budget. Most arrive in 1–2 days with Prime.</p>
    <div class="ideas" id="ideas"></div>
    <p class="disclosure">We may earn a commission from Amazon links, which keeps ${S} free.</p>
  </div>
  <div class="card center">
    <h2>Running another exchange? 🎅</h2>
    <p class="muted">Work, friends, the other side of the family: draw names free in 30 seconds, no sign-up.</p>
    <a class="btn primary" href="${base}/">Start your own Secret Santa</a>
  </div>
  ${supportBlock()}
</div>`,
  };

  // ================= GIFT IDEA PAGES =================
  const tiers = [
    ["10", "Secret Santa Gift Ideas Under $10", "Cheap doesn't have to mean boring. These are the best Secret Santa gifts under $10. Each one feels thoughtful, gets used, and works for coworkers, classmates and big groups.", "Under $10 is the classic budget for large offices, schools and casual friend groups. The trick is to pick something consumable or useful every day so it never ends up in a drawer."],
    ["20", "Secret Santa Gift Ideas Under $20", "The best Secret Santa gifts under $20 for coworkers, friends and family: cozy, useful and fun picks that look like you spent more.", "$20 is the most popular Secret Santa budget, especially at work. It's enough for something useful that still feels a little indulgent."],
    ["25", "Secret Santa Gift Ideas Under $25", "Thoughtful Secret Santa gifts under $25 that people actually want. Ideas for him, for her, coworkers and friends, all with fast shipping.", "At $25 you can move past novelty items into gifts with real quality: kitchen staples, games and small tech."],
    ["50", "Secret Santa Gift Ideas Under $50", "Premium Secret Santa gifts under $50 for families and close friends: wow-factor gadgets, cozy luxuries and kitchen upgrades.", "A $50 budget usually means family or close friends. Aim for something they'd love but wouldn't buy for themselves."],
  ];
  const tipList = `<h2>Tips for choosing a Secret Santa gift</h2><ul>
<li><b>Check their wishlist first.</b> ${S} shows each person's wishlist on their reveal page.</li>
<li><b>Stick to the budget.</b> Going far over can make others feel awkward.</li>
<li><b>Consumables are safe.</b> Snacks, candles and coffee never clutter a home.</li>
<li><b>Include a gift receipt</b> in case of sizing or duplicates.</li>
<li><b>Order early.</b> Shipping slows down a lot in mid-December.</li></ul>`;
  const giftPages = tiers.map(([t, h1, desc, intro]) => {
    const path = `/secret-santa-gift-ideas-under-${t}/`;
    return {
      path,
      priority: 0.9,
      title: `${h1} (${year}): ${t === "10" ? "Cheap but Thoughtful" : "Best Picks"}`,
      description: desc,
      schema: [crumbs(h1, path)],
      body: `<article><section class="hero"><h1>${h1}</h1><p>${desc}</p></section>
<p>${intro}</p>
${ideaCards(t)}
<p class="disclosure">As an Amazon Associate we earn from qualifying purchases.</p>
${tipList}
<div class="card center"><h2>Haven't drawn names yet?</h2><p class="muted">Set a $${t} budget and send everyone a private link. Free, no sign-up.</p><a class="btn primary" href="${base}/?budget=${t}">Draw names with a $${t} budget</a></div>
<p>More budgets: ${tiers.filter((x) => x[0] !== t).map((x) => `<a href="${base}/secret-santa-gift-ideas-under-${x[0]}/">under $${x[0]}</a>`).join(" · ")}</p>
</article>`,
    };
  });

  const giftHub = {
    path: "/secret-santa-gift-ideas/",
    priority: 0.9,
    title: `Secret Santa Gift Ideas ${year}: Best Gifts by Budget`,
    description: "The best Secret Santa gift ideas for every budget: under $10, $20, $25 and $50. Gifts for coworkers, friends and family that people actually want.",
    schema: [crumbs("Secret Santa Gift Ideas", "/secret-santa-gift-ideas/")],
    body: `<article><section class="hero"><h1>Secret Santa Gift Ideas</h1><p>Hand-picked gifts by budget, so you're never stuck staring at a store shelf.</p></section>
${tiers.map(([t, h1]) => `<h2><a href="${base}/secret-santa-gift-ideas-under-${t}/">${h1} →</a></h2>${ideaCards(t, 3)}`).join("")}
<p class="disclosure">As an Amazon Associate we earn from qualifying purchases.</p>
${tipList}${cta()}</article>`,
  };

  // ================= GUIDES =================
  const rulesFaq = faqBlock([
    ["What is the point of Secret Santa?", "Secret Santa lets a group exchange gifts without everyone buying for everyone. Each person buys one gift for one randomly assigned person, which keeps costs low and adds some mystery."],
    ["Do you reveal who your Secret Santa was?", "It's up to your group. Some groups reveal at the party, some have everyone guess first, and some keep it secret forever."],
    ["What is a good Secret Santa budget?", "$20–$25 is the most common budget. Offices often choose $10–$20, and families often go up to $50."],
    ["What's the difference between Secret Santa and White Elephant?", `In Secret Santa each person buys for one assigned person. In White Elephant everyone brings one anonymous gift and players pick or steal gifts in turn. <a href="${base}/white-elephant-rules/">See White Elephant rules</a>.`],
  ]);
  const guides = [
    {
      path: "/secret-santa-rules/",
      title: "Secret Santa Rules: How to Play (Simple Guide + Etiquette)",
      description: "Simple Secret Santa rules for families, friends and offices: how to draw names, set a budget, exchange gifts and reveal Santas, plus etiquette tips.",
      schema: [rulesFaq.schema, crumbs("Secret Santa Rules", "/secret-santa-rules/")],
      body: `<article><section class="hero"><h1>Secret Santa Rules</h1><p>Everything you need to run a fair, fun gift exchange.</p></section>
<h2>The basic rules</h2><ol>
<li><b>Draw names randomly.</b> Every participant is secretly assigned one other person. Nobody can draw themselves. Use a <a href="${base}/">Secret Santa generator</a> so it's instant and fair.</li>
<li><b>Keep it secret.</b> Don't tell anyone who you drew, especially not the person you're buying for.</li>
<li><b>Agree on a budget.</b> Everyone spends roughly the same amount, usually $20–$25.</li>
<li><b>Set a deadline.</b> Pick the date and place where gifts get exchanged.</li>
<li><b>Buy one gift</b> for your person, wrap it, and label it with their name (not yours).</li>
<li><b>Exchange gifts.</b> Gifts are handed out at the party, or mailed for remote groups.</li>
<li><b>The reveal (optional).</b> People guess their Santa, then Santas reveal themselves.</li></ol>
<h2>Optional rules that make it better</h2><ul>
<li><b>Wishlists:</b> each person lists a few ideas or hobbies. ${S} shows these on each reveal.</li>
<li><b>Exclusions:</b> couples and housemates shouldn't draw each other.</li>
<li><b>Themes:</b> "something handmade", "a book", "something under $10 that's red".</li>
<li><b>No gift cards</b>, or <i>only</i> gift cards. Decide up front.</li></ul>
<h2>Secret Santa etiquette</h2><ul>
<li>Don't go wildly over or under budget.</li>
<li>Avoid gag gifts at work unless everyone has agreed to them.</li>
<li>Thank your Santa, even if the gift isn't your style.</li>
<li>If you drop out, tell the organizer early so they can redraw.</li></ul>
${cta()}${rulesFaq.html}</article>`,
    },
    {
      path: "/office-secret-santa/",
      title: "How to Organize an Office Secret Santa (Free Tool + Tips)",
      description: "A step-by-step guide to running an office Secret Santa: choosing a budget, inclusive rules, remote coworkers, gift ideas and a free name-draw tool.",
      schema: [crumbs("Office Secret Santa", "/office-secret-santa/")],
      body: `<article><section class="hero"><h1>How to Organize an Office Secret Santa</h1><p>Run a stress-free work gift exchange in 10 minutes.</p></section>
<h2>1. Make it opt-in</h2><p>Send a quick message in Slack, Teams or email asking who wants to join. Never pressure coworkers. Some people can't afford it or don't celebrate.</p>
<h2>2. Pick a modest budget</h2><p>$10–$25 is standard at work. Choose a number everyone is comfortable with, then browse <a href="${base}/secret-santa-gift-ideas-under-20/">gift ideas under $20</a>.</p>
<h2>3. Collect wishlists</h2><p>Ask people for 2–3 likes (coffee, plants, board games) and anything to avoid (allergies, alcohol). Use our <a href="${base}/secret-santa-questionnaire/">Secret Santa questionnaire</a>.</p>
<h2>4. Draw names online</h2><p>Paste the list into the <a href="${base}/">${S} generator</a>, add the budget and party date, then DM each coworker their private link. No accounts or work emails needed, and HR won't have to manage a spreadsheet.</p>
<h2>5. Include remote teammates</h2><p>Remote coworkers can mail gifts directly or send a digital gift. Schedule a short video call for the unwrapping.</p>
<h2>Office-appropriate gift rules</h2><ul><li>Keep it work-safe: no gag gifts that could embarrass anyone.</li><li>Avoid alcohol unless you know it's welcome.</li><li>Consumables, desk upgrades and cozy items are always safe.</li></ul>
${cta("Draw names for your office →")}</article>`,
    },
    {
      path: "/virtual-secret-santa/",
      title: "Virtual Secret Santa: How to Run an Online Gift Exchange",
      description: "How to run a virtual Secret Santa for remote teams and long-distance families: drawing names online, shipping gifts, and hosting the video-call reveal.",
      schema: [crumbs("Virtual Secret Santa", "/virtual-secret-santa/")],
      body: `<article><section class="hero"><h1>Virtual Secret Santa</h1><p>A long-distance gift exchange that still feels like Christmas.</p></section>
<h2>How a virtual Secret Santa works</h2><p>It's the same as a regular Secret Santa, except names are drawn online and gifts are shipped. The fun happens on a video call where everyone unwraps together.</p>
<h2>Step by step</h2><ol>
<li><b>Draw names online</b> with the <a href="${base}/">free ${S} generator</a>. Send each person their link in your group chat or by DM.</li>
<li><b>Share addresses privately.</b> Add a note in the exchange details telling people to DM the organizer for their match's address, or ship to the organizer.</li>
<li><b>Set a "ship by" date</b> at least 7–10 days before the call. Online stores get slow in December.</li>
<li><b>Order online</b> and ship directly. Most stores offer gift wrap and gift receipts.</li>
<li><b>Host the reveal call.</b> Go around one by one: open the gift, guess your Santa, then the Santa reveals.</li></ol>
<h2>Gifts that ship well</h2>${ideaCards("25", 6)}<p class="disclosure">As an Amazon Associate we earn from qualifying purchases.</p>
${cta("Start a virtual Secret Santa →")}</article>`,
    },
    {
      path: "/secret-santa-questionnaire/",
      title: "Free Printable Secret Santa Questionnaire (Copy & Paste Questions)",
      description: "A free Secret Santa questionnaire with 20 questions to find out what your coworkers, friends or family really want. Print it or copy it into a group chat.",
      schema: [crumbs("Secret Santa Questionnaire", "/secret-santa-questionnaire/")],
      body: `<article><section class="hero"><h1>Secret Santa Questionnaire</h1><p>20 questions that make gift-shopping easy. Print it, or copy it into your group chat.</p>
<p class="noprint"><button class="btn" onclick="window.print()">🖨️ Print questionnaire</button></p></section>
<div class="card"><h2>🎄 My Secret Santa wishlist</h2>
<p>Name: ______________________</p><ol>
<li>My favorite color(s):</li><li>Favorite snack or treat:</li><li>Coffee, tea, or hot chocolate?</li><li>Favorite scent (candles, lotions):</li><li>Hobbies I love:</li><li>A store I could shop at all day:</li><li>Favorite book, movie, or TV genre:</li><li>Music I'm into:</li><li>Sports team / activities I follow:</li><li>Indoors cozy or outdoors adventure?</li><li>Something I collect:</li><li>A small luxury I'd never buy myself:</li><li>Something I need for my desk / home:</li><li>Shirt size / sock size (optional):</li><li>Allergies or dietary restrictions:</li><li>Things I do NOT want:</li><li>Gift cards: yes or no?</li><li>Handmade gifts: love them or skip?</li><li>My favorite holiday tradition:</li><li>If I won $100 today I'd spend it on:</li></ol></div>
<p class="noprint">Tip: when you use the <a href="${base}/">${S} generator</a>, paste each person's top 2–3 answers into their <b>wishlist</b> box. Their Secret Santa will see it the moment they unwrap their match.</p>
${cta()}</article>`,
    },
    {
      path: "/white-elephant-rules/",
      title: "White Elephant Gift Exchange Rules (Simple Steps + Stealing Rules)",
      description: "Easy White Elephant gift exchange rules: how to pick numbers, how stealing works, how many steals are allowed, and how it differs from Secret Santa.",
      schema: [crumbs("White Elephant Rules", "/white-elephant-rules/")],
      body: `<article><section class="hero"><h1>White Elephant Rules</h1><p>The gift exchange where stealing is encouraged.</p></section>
<h2>How to play White Elephant</h2><ol>
<li>Everyone brings <b>one wrapped, anonymous gift</b> within the agreed budget.</li>
<li>Gifts go in a pile. Everyone <b>draws a number</b> to set the turn order.</li>
<li><b>Player 1</b> opens a gift from the pile.</li>
<li>Each next player either <b>opens a new gift</b> or <b>steals</b> an already-opened gift.</li>
<li>Anyone whose gift is stolen picks again: open a new one or steal from someone else (but not the gift just taken from them).</li>
<li>The game ends when every gift is opened. Player 1 often gets a final chance to swap.</li></ol>
<h2>Common stealing rules</h2><ul><li>A gift can be stolen a maximum of <b>3 times</b>. After that it's "frozen".</li><li>No immediate steal-backs.</li><li>Set a max number of steals per turn so the game keeps moving.</li></ul>
<h2>White Elephant vs. Secret Santa</h2><p>White Elephant is a party game where gifts are random and often funny. In <a href="${base}/secret-santa-rules/">Secret Santa</a>, each person buys a thoughtful gift for one specific person whose name was drawn. Many groups do both!</p>
<h2>Good White Elephant gifts</h2>${ideaCards("20", 6)}<p class="disclosure">As an Amazon Associate we earn from qualifying purchases.</p>
${cta("Doing Secret Santa instead? Draw names →")}</article>`,
    },
    {
      path: "/privacy/",
      priority: 0.2,
      title: `Privacy Policy | ${S}`,
      description: `How ${S} handles your data (short version: we don't collect it).`,
      body: `<article><h1>Privacy Policy</h1><p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>
<p><b>Short version: ${S} doesn't have a database. Your names never leave your browser.</b></p>
<h2>Secret Santa draws</h2><p>Names, wishlists and draw results are processed in your browser. They're stored in your browser's local storage (so you can reopen your draw) and inside each private reveal link, after the <code>#</code> symbol, a part of the URL browsers never send to servers.</p>
<h2>Analytics &amp; advertising</h2><p>We may use privacy-respecting analytics (such as Google Analytics) to count visits, and may show ads through Google AdSense. These services may use cookies. You can opt out of personalized advertising at <a href="https://adssettings.google.com">Google Ad Settings</a>.</p>
<h2>Affiliate links</h2><p>${S} is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn fees by linking to Amazon.com. If you buy through our links we may earn a commission at no extra cost to you.</p>
<h2>Contact</h2><p>Questions? Open an issue on our GitHub repository.</p></article>`,
    },
    {
      path: "/404.html",
      noindex: true,
      title: `Page not found | ${S}`,
      description: "Page not found.",
      body: `<section class="hero"><h1>This page got lost in the snow ❄️</h1><p><a href="${base}/">Go to the Secret Santa generator</a></p></section>`,
    },
  ];

  return [home, reveal, giftHub, ...giftPages, ...guides];
}
