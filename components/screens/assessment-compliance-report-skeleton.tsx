import { Skeleton } from "@/components/ui/skeleton"

/** Placeholder chrome while assessment report payload is fetched. */
export function AssessmentComplianceReportSkeleton() {
  return (
    <article
      className="assessment-compliance-report relative isolate mx-auto max-w-[210mm] rounded-sm border border-neutral-300 bg-white px-[14mm] py-10 font-sans shadow-sm print:border-0 print:shadow-none"
      aria-hidden
    >
      <div className="relative z-10">
        <header className="break-inside-avoid">
          <div className="flex flex-row flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-4">
              <Skeleton className="h-9 max-w-[18rem]" />
              <ul className="list-none space-y-2">
                {Array.from({ length: 7 }, (_, i) => (
                  <li key={i}>
                    <Skeleton className={`h-4 ${i >= 5 ? "max-w-xl" : "max-w-md"}`} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 max-sm:w-full max-sm:flex max-sm:justify-end">
              <Skeleton className="h-[4.85rem] w-32 rounded-sm shadow-sm border border-neutral-200" />
            </div>
          </div>
        </header>

        <Skeleton className="my-6 h-0.5 w-full max-w-full rounded-full" />

        <section className="mt-7 space-y-3">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-0 overflow-hidden rounded border border-neutral-200">
            <Skeleton className="h-9 w-full rounded-none bg-neutral-200/90" />
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton
                key={i}
                className={`h-10 w-full rounded-none border-t border-neutral-200 ${i % 2 === 1 ? "opacity-90" : ""}`}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-3">
          <Skeleton className="h-5 w-44" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </section>

        <section className="mt-8 space-y-6">
          <Skeleton className="h-5 w-[min(280px,100%)]" />
          {[0, 1].map((block) => (
            <div key={block} className="break-inside-avoid space-y-3">
              <Skeleton className="h-5 w-[min(90%,520px)]" />
              <Skeleton className="h-3 w-full max-w-xl" />
              <div className="overflow-hidden rounded border border-neutral-200">
                <Skeleton className="h-9 w-full rounded-none bg-neutral-200/90" />
                {Array.from({ length: 5 }, (_, row) => (
                  <Skeleton
                    key={row}
                    className="h-8 w-full rounded-none border-t border-neutral-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </article>
  )
}
