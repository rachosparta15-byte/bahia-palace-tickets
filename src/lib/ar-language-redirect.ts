/*
 * The inline script that sends a non-Arabic-speaking visitor from /ar to
 * their own language.
 *
 * WHY THIS EXISTS
 *
 * Google's knowledge panel "Website" button for Bahia Palace points at
 * /ar, and Search Console shows what that does. Over seven days /ar takes
 * 1,334 clicks, and the highest-converting slice of them is filed under
 * "Morocco" — not Moroccans, but foreign tourists already in Marrakech,
 * searching from a Moroccan IP. They are the best traffic on the site: 3.7%
 * CTR against France's 0.4%, position 4.0, and roughly half of them buy.
 *
 * They arrive on a page written in Arabic.
 *
 * IP says Morocco for a local and a French tourist alike. The browser's
 * language list is what tells them apart, which is why that is the test.
 *
 * WHAT IT MUST NOT DO
 *
 * Break /ar. That ranking is what delivers those visitors in the first
 * place, so a redirect that Googlebot follows would cost exactly the traffic
 * it is meant to rescue. Two guards, in order:
 *
 *   1. the user-agent list below, which covers every declared crawler
 *   2. the referrer must be Google or empty — a crawler arriving from
 *      somewhere else is refused
 *
 * Empty is allowed on purpose: the Maps app opens the site with no referrer,
 * and that is the exact flow this is built for. The cost is that the UA list
 * carries more weight than it otherwise would, which is why the deploy
 * checklist puts "Test live URL" on /ar on day one — Google's own renderer,
 * showing what it actually sees.
 *
 * Anything unexpected — storage throwing, a referrer that will not parse, no
 * matching language — means DO NOT REDIRECT. The page stays as it is.
 */

const BOT_PATTERN =
  'bot|crawl|spider|preview|lighthouse|headless|pagespeed|Googlebot|Google-InspectionTool|' +
  'GoogleOther|AdsBot-Google|Mediapartners-Google|Storebot-Google|bingbot|Applebot|DuckDuckBot|' +
  'YandexBot|Baiduspider|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot';

/** The locales a visitor can be sent to. Arabic is the page they are on. */
const TARGETS = ['fr', 'en', 'it', 'es', 'de', 'pt'];

/**
 * Minified by hand rather than by a bundler: this goes inline in <head> and
 * runs before the first paint, so it cannot wait for a chunk to load.
 */
export const AR_LANGUAGE_REDIRECT = `(function(){try{
var p=location.pathname.replace(/\\/$/,'');
if(p!=='/ar')return;
if(/[?&]lang=ar(?:&|$)/.test(location.search))return;
if(new RegExp('${BOT_PATTERN}','i').test(navigator.userAgent||''))return;
var r=document.referrer;
if(r){var h;try{h=new URL(r).hostname}catch(e){return}
if(!/(^|\\.)google\\.[a-z]{2,3}(\\.[a-z]{2})?$/i.test(h))return}
var L=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']);
var i,l,b,t=null;
for(i=0;i<L.length;i++){l=String(L[i]||'').toLowerCase();if(l==='ar'||l.indexOf('ar-')===0)return}
for(i=0;i<L.length&&!t;i++){b=String(L[i]||'').toLowerCase().split('-')[0];
if(${JSON.stringify(TARGETS)}.indexOf(b)>-1)t=b}
if(!t)return;
try{if(sessionStorage.getItem('langRedirectDone'))return;sessionStorage.setItem('langRedirectDone','1')}catch(e){return}
location.replace('/'+t+location.search+location.hash)
}catch(e){}})();`;
