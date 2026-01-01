import MagazineCard from "./MagazineCard"
import { Skeleton } from "@/components/ui/skeleton"

export default function MagazineGrid({ magazines, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-48" />
          </div>
        ))}
      </div>
    )
  }

  if (!magazines || magazines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-neutral-400 text-lg font-light tracking-wide">
          Nenhuma edição disponível no momento
        </p>
        <p className="text-neutral-300 text-sm mt-2">
          Volte em breve para novas publicações
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {magazines.map((magazine, index) => (
        <MagazineCard key={magazine.id} magazine={magazine} index={index} />
      ))}
    </div>
  )
}
