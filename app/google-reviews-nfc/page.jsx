// app/google-reviews-nfc/page.jsx
// Canonical page for «Παρουσία στο Google» — kept at the original URL to
// preserve its indexing; the old review-stand content is merged in here.
import { getService } from '@/lib/services';
import { serviceMetadata, ServiceSchema } from '@/lib/schema';
import GoogleReviewsClient from '@/components/service/GoogleReviewsClient';

const service = getService('google-reviews-nfc');

export const metadata = serviceMetadata(service);

export default function Page() {
  return (
    <>
      <ServiceSchema service={service} />
      <GoogleReviewsClient />
    </>
  );
}
