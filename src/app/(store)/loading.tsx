import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="heng-container py-24">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-6 h-10 w-full max-w-xl" />
      <Skeleton className="mt-4 h-4 w-full max-w-md" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="mt-4 h-4 w-32" />
          </div>
        ))}
      </div>
      <span className="sr-only">Učitavanje…</span>
    </div>
  );
}
