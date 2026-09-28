import { Skeleton } from '@/components/ui/Skeleton';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="heng-container py-24">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-6 h-12 w-full max-w-lg" />
      <div className="heng-rule my-12" />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <li key={i}><ProductCardSkeleton /></li>)}
      </ul>
      <span className="sr-only">Učitavanje kolekcije…</span>
    </div>
  );
}
