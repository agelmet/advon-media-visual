// app/ai-voithos/page.jsx
import { getService } from '@/lib/services';
import { serviceMetadata, ServiceSchema } from '@/lib/schema';
import AiVoithosClient from '@/components/service/AiVoithosClient';

const service = getService('ai-voithos');

export const metadata = serviceMetadata(service);

export default function Page() {
  return (
    <>
      <ServiceSchema service={service} />
      <AiVoithosClient />
    </>
  );
}
