// app/google-ads/page.jsx — «Google Ads» (services v3, Oct 2026)
import { getService } from '@/lib/services';
import { serviceMetadata, ServiceSchema } from '@/lib/schema';
import GoogleAdsClient from '@/components/service/GoogleAdsClient';

const service = getService('google-ads');

export const metadata = serviceMetadata(service);

export default function Page() {
  return (
    <>
      <ServiceSchema service={service} />
      <GoogleAdsClient service={service} />
    </>
  );
}
