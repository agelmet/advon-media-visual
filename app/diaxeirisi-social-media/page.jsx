// app/diaxeirisi-social-media/page.jsx — «Social Media» (services v3, Oct 2026)
import { getService } from '@/lib/services';
import { serviceMetadata, ServiceSchema } from '@/lib/schema';
import SocialClient from '@/components/service/SocialClient';

const service = getService('diaxeirisi-social-media');

export const metadata = serviceMetadata(service);

export default function Page() {
  return (
    <>
      <ServiceSchema service={service} />
      <SocialClient service={service} />
    </>
  );
}
