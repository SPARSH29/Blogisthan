export default function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white border border-purple-100 shadow-md animate-pulse">
      {/* Image */}
      <div className="h-48 w-full bg-gray-200" />

      <div className="p-6">
        {/* Category */}
        <div className="h-5 w-20 rounded bg-gray-200 mb-4" />

        {/* Title */}
        <div className="h-6 w-3/4 rounded bg-gray-200 mb-3" />
        <div className="h-6 w-1/2 rounded bg-gray-200 mb-5" />

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>

          <div className="h-9 w-24 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}