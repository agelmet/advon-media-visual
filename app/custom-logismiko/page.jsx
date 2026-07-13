// app/custom-logismiko/page.jsx
import { getService } from '@/lib/services';
import { serviceMetadata, ServiceSchema } from '@/lib/schema';
import LogismikoClient from '@/components/service/LogismikoClient';

const service = getService('custom-logismiko');

export const metadata = serviceMetadata(service);

export default function Page() {
  return (
    <>
      <ServiceSchema service={service} />
      <LogismikoClient />
    </>
  );
}
