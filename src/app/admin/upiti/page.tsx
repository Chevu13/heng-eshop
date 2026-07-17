import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { adminInquiries } from '@/lib/admin/queries';
import { AdminHeading, TableEmpty } from '@/components/admin/AdminUI';
import { InquiryFilters, InquiryCard } from '@/components/admin/InquiryPanel';

export const metadata: Metadata = { title: 'Upiti' };
export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage({
  searchParams,
}: { searchParams: { status?: string } }) {
  await requireAdmin();
  const inquiries = await adminInquiries(searchParams.status);

  return (
    <>
      <AdminHeading
        title="Projektni upiti"
        description="Upiti sa strana Projekti i Kontakt, sa prilozima i internim beleškama."
      />

      <InquiryFilters />

      {inquiries.length === 0 ? (
        <div className="mt-8">
          <TableEmpty
            title={searchParams.status ? 'Nema upita u ovom statusu' : 'Još nema upita'}
            description="Upiti poslati sa sajta pojaviće se ovde automatski."
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {inquiries.map((q) => <InquiryCard key={q.id} inquiry={q} />)}
        </ul>
      )}
    </>
  );
}
