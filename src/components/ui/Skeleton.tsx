export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-sm ${className}`} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="mt-4 h-3 w-24" />
      <Skeleton className="mt-3 h-5 w-40" />
      <Skeleton className="mt-3 h-4 w-28" />
    </div>
  );
}
