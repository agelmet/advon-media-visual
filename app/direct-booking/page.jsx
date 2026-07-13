// app/direct-booking/page.jsx
import { getService } from '@/lib/services';
import { serviceMetadata, ServiceSchema } from '@/lib/schema';
import DirectBookingClient from '@/components/service/DirectBookingClient';

const service = getService('direct-booking');

export const metadata = serviceMetadata(service);

export default function Page() {
  return (
    <>
      <ServiceSchema service={service} />
      <DirectBookingClient />
    </>
  );
}
