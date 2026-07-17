import { Skeleton } from '@/components/ui/Skeleton';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="heng-container py-24">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-6 h-12 w-full max-w-lg" />
      <div className="heng-rule my-12" />
      <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => <li key={i}><ProductCardSkeleton /></li>)}
      </ul>
      <span className="sr-only">Učitavanje kolekcije…</span>
    </div>
  );
}
