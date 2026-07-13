// app/online-rantevou/page.jsx
import { getService } from '@/lib/services';
import { serviceMetadata, ServiceSchema } from '@/lib/schema';
import RantevouClient from '@/components/service/RantevouClient';

const service = getService('online-rantevou');

export const metadata = serviceMetadata(service);

export default function Page() {
  return (
    <>
      <ServiceSchema service={service} />
      <RantevouClient />
    </>
  );
}
