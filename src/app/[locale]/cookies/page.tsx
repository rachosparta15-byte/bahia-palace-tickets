import { LegalPage } from '@/components/legal/LegalPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return { robots: 'noindex' };
  return {
    title: 'Cookie Policy — How Visitbahiapalace.com Uses Cookies',
    description: 'Visitbahiapalace.com uses cookies to improve your experience and process bookings. Read our cookie policy to understand what data we collect and why.',
  };
}

export default async function CookiePolicyPage() {
  const t = await getTranslations('breadcrumb');
  return (
    <LegalPage
      homeLabel={t('home')}
      title="Cookie Policy"
      subtitle="We use cookies to make our website work well and improve your experience."
      lastUpdated="15 November 2025"
      sections={[
        {
          heading: 'What Are Cookies?',
          body: 'Cookies are small text files stored in your browser when you visit a website. They help websites remember your preferences and understand how visitors use the site.',
        },
        {
          heading: 'Cookies We Use',
          body: [
            'Essential cookies: required for the website to function (session, security, language preference). Cannot be disabled.',
            'Analytics cookies: anonymous data about how visitors use our site (pages visited, time spent). We use this to improve the experience.',
            'Preference cookies: remember your locale and currency selection.',
          ],
        },
        {
          heading: 'Cookies We Do NOT Use',
          body: [
            'We do not use advertising or tracking cookies.',
            'We do not share cookie data with third-party advertisers.',
            'We do not use cross-site tracking technologies.',
          ],
        },
        {
          heading: 'Third-Party Cookies',
          body: 'Our payment provider Stripe may set cookies during the checkout process to detect fraud and ensure payment security. These are essential and cannot be disabled.',
        },
        {
          heading: 'Managing Cookies',
          body: 'You can control cookies through your browser settings. Please note that disabling essential cookies may prevent some parts of the website from working correctly. To opt out of analytics cookies, adjust your browser settings or contact us.',
        },
        {
          heading: 'Contact',
          body: 'Questions about our use of cookies? Email us at support@visitbahiapalace.com.',
        },
      ]}
    />
  );
}
