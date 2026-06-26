export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-indigo-200/80 bg-white/75 p-8 text-sm text-slate-500 shadow-sm shadow-slate-200/60 backdrop-blur">
      <div className="w-full max-w-md space-y-4">
        <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
          </span>
          <span className="font-medium">{label}</span>
        </div>
        <div className="grid gap-2">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton mx-auto h-3 w-4/5" />
        </div>
      </div>
    </div>
  );
}
