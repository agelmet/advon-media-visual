// app/ai-voithos/page.jsx
import { getService } from '@/lib/services';
import { serviceMetadata, ServiceSchema } from '@/lib/schema';
import ServicePageClient from '@/components/service/ServicePageClient';

const service = getService('ai-voithos');

export const metadata = serviceMetadata(service);

export default function Page() {
  return (
    <>
      <ServiceSchema service={service} />
      <ServicePageClient slug="ai-voithos" />
    </>
  );
}
