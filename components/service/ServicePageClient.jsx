// components/service/ServicePageClient.jsx
// Standard dedicated service page: hero+pitch → pain → how it works →
// what's included → proof strip → FAQ → CTA band. The global layout adds
// the contact form + footer below.
'use client';

import { getService } from '@/lib/services';
import {
  ServiceHero,
  PainSection,
  StepsSection,
  IncludesSection,
  ProofStrip,
  FaqSection,
  CtaBand,
} from '@/components/service/blocks';

export default function ServicePageClient({ slug }) {
  const service = getService(slug);
  if (!service) return null;

  return (
    <>
      <ServiceHero service={service} />
      <PainSection service={service} />
      <StepsSection service={service} />
      <IncludesSection service={service} />
      <ProofStrip />
      <FaqSection service={service} />
      <CtaBand />
    </>
  );
}
