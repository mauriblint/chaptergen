import { isAudioFile } from './media'

interface MixpanelPeople {
  set: (props: Record<string, unknown>) => void
}

interface MixpanelClient {
  track: (eventName: string, props?: Record<string, unknown>) => void
  track_pageview: (props?: Record<string, unknown>) => void
  identify: (id: string) => void
  reset: () => void
  people: MixpanelPeople
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
    mixpanel?: MixpanelClient
  }
}

export const GA4_MEASUREMENT_ID = 'G-06FKFB597H'
const MIXPANEL_TOKEN = 'cbf1db474fa2444dfb41a908cdb2c1f0'

function isMixpanelEnabled(): boolean {
  if (typeof window === 'undefined' || !import.meta.env.PROD) return false
  const host = window.location.hostname
  return host === 'chaptergen.com' || host === 'www.chaptergen.com'
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(...args)
}

function mixpanel(): MixpanelClient | null {
  if (!isMixpanelEnabled() || !window.mixpanel) return null
  return window.mixpanel
}

export function initMixpanel(): void {
  if (!isMixpanelEnabled() || window.mixpanel) return

  const script = document.createElement('script')
  script.text = `
    (function(e,c){if(!c.__SV){var l,h;window.mixpanel=c;c._i=[];c.init=function(q,r,f){function t(d,a){var g=a.split(".");2==g.length&&(d=d[g[0]],a=g[1]);d[a]=function(){d.push([a].concat(Array.prototype.slice.call(arguments,0)))}}var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";b.people=b.people||[];b.toString=function(d){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);d||(a+=" (stub)");return a};b.people.toString=function(){return b.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders start_session_recording stop_session_recording people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
    for(h=0;h<l.length;h++)t(b,l[h]);var n="set set_once union unset remove delete".split(" ");b.get_group=function(){function d(p){a[p]=function(){b.push([g,[p].concat(Array.prototype.slice.call(arguments,0))])}}for(var a={},g=["get_group"].concat(Array.prototype.slice.call(arguments,0)),m=0;m<n.length;m++)d(n[m]);return a};c._i.push([q,r,f])};c.__SV=1.2;var k=e.createElement("script");k.type="text/javascript";k.async=!0;k.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===
    e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=e.getElementsByTagName("script")[0];e.parentNode.insertBefore(k,e)}})(document,window.mixpanel||[]);
    mixpanel.init(${JSON.stringify(MIXPANEL_TOKEN)}, {
      autocapture: true,
      record_sessions_percent: 100,
    });
  `
  document.head.appendChild(script)
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  gtag('event', eventName, params)
  mixpanel()?.track(eventName, params)
}

export function trackPageView(path: string) {
  mixpanel()?.track_pageview({ page: path })
}

export function identifyUser(user: {
  id: string
  email: string
  locale: string
  credits: number
}) {
  const mp = mixpanel()
  if (!mp) return
  mp.identify(user.id)
  mp.people.set({
    $email: user.email,
    locale: user.locale,
    credits: user.credits,
  })
}

export function resetAnalytics() {
  mixpanel()?.reset()
}

export function trackChapterGenerated(options: {
  fileName: string
  chapterCount: number
  autoMode: boolean
  isRefine: boolean
}) {
  trackEvent(options.isRefine ? 'refine_chapters' : 'generate_chapters', {
    chapter_count: options.chapterCount,
    auto_mode: options.autoMode,
    media_type: isAudioFile(options.fileName) ? 'audio' : 'video',
  })
}

export function trackUpload() {
  trackEvent('Upload')
}

export function trackUploadError(error: string) {
  trackEvent('UploadError', { error })
}

export function trackUpgrade(loggedIn: boolean, reason?: string) {
  trackEvent('Upgrade', {
    user_type: loggedIn ? 'logged_in' : 'anonymous',
    logged_in: loggedIn,
    ...(reason ? { reason } : {}),
  })
}

export function trackViewCheckout(plan: string) {
  trackEvent('ViewCheckout', { plan })
}

export function trackPaymentCompleted(options: { plan: string; credits: number }) {
  trackEvent('PaymentCompleted', {
    plan: options.plan,
    credits: options.credits,
  })
}
