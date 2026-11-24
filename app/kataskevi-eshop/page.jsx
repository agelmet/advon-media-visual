// app/kataskevi-eshop/page.jsx — «Κατασκευή E-shop» (24 Nov 2026)
import { getService } from '@/lib/services';
import { serviceMetadata, ServiceSchema } from '@/lib/schema';
import EshopClient from '@/components/service/EshopClient';

const service = getService('kataskevi-eshop');

export const metadata = serviceMetadata(service);

export default function Page() {
  return (
    <>
      <ServiceSchema service={service} />
      <EshopClient service={service} />
    </>
  );
}
