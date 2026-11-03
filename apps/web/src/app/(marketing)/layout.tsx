import type { ReactNode } from "react";

import { ActionBar } from "@/components/layout/action-bar";
import { AnalyticsConsent } from "@/components/layout/analytics-consent";
import { PlaceholderOverlay } from "@/components/layout/placeholder-overlay";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { PageTransition } from "@/components/motion/page-transition";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import { getClasses, getLegal, getNavigation, getSite } from "@/content";
import { telHref, whatsappHref } from "@/lib/contact";
import { isProduction } from "@/lib/env";
import { organizationJsonLd } from "@/lib/structured-data";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const site = getSite();
  const legal = getLegal();
  const [navigation, classes] = await Promise.all([getNavigation(), getClasses()]);
  const waHref = whatsappHref(site.whatsapp.number, site.whatsapp.prefill);
  const brandProps = { name: site.name };

  return (
    <>
      <a
        href="#main"
        className="sr-only z-(--z-cursor) bg-gold px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {navigation.skipLink}
      </a>

      <SiteHeader
        brand={brandProps}
        links={navigation.header}
        cta={navigation.cta.trial}
        menu={{
          labels: navigation.menuLabel,
          contact: {
            phoneDisplay: site.phone.display,
            telHref: telHref(site.phone.e164),
            whatsappHref: waHref,
            email: site.email,
          },
          social: site.social,
          tagline: site.signature,
        }}
      />

      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>

      <SiteFooter />

      <ActionBar
        labels={navigation.actionBar}
        telHref={telHref(site.phone.e164)}
        whatsappHref={waHref}
        trialHref={navigation.cta.trial.href}
      />
      <WhatsappFab href={waHref} label={navigation.actionBar.whatsapp} />

      <AnalyticsConsent
        gaId={site.analytics.gaMeasurementId}
        requireConsent={site.analytics.requireConsent}
        copy={legal.cookie}
        privacyHref="/privacy"
      />
      <SmoothScroll enabled={site.features.smoothScroll} />
      <PageTransition enabled={site.features.pageTransitions} />
      <CustomCursor enabled={site.features.customCursor} />
      {!isProduction ? <PlaceholderOverlay /> : null}

      <JsonLd data={organizationJsonLd(site, classes)} />
    </>
  );
}
