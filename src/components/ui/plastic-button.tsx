import { cn } from "@/lib/utils";

export function PlasticButton({ 
  text, 
  disabled = false 
}: { 
  text: string; 
  disabled?: boolean; 
}) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "relative inline-block px-4 py-1.75 rounded-full text-black font-medium text-sm transition-all duration-200" ,
        "bg-gradient-to-b from-cyan-400 to-cyan-500",
        "active:scale-[0.98] flex justify-center items-center",
        disabled && "opacity-50 cursor-not-allowed active:scale-100"
      )}
      style={{
        background: disabled 
          ? `linear-gradient(to bottom, rgb(101, 231, 252, 0.5), rgb(6, 182, 212, 0.5))`
          : `linear-gradient(to bottom, rgb(101, 231, 252), rgb(6, 182, 212))`,
        boxShadow: disabled
          ? `0 2px 8px 0 rgba(6, 182, 212, 0.15), 0 1.5px 0 0 rgba(255,255,255,0.1) inset, 0 -2px 8px 0 rgba(6, 182, 212, 0.25) inset`
          : `0 2px 8px 0 rgba(6, 182, 212, 0.35), 0 1.5px 0 0 rgba(255,255,255,0.25) inset, 0 -2px 8px 0 rgba(6, 182, 212, 0.5) inset`,
      }}
    >
      <span className="relative z-10">{text}</span>
      <span
        className="absolute left-1/2 top-0 z-20 w-[80%] h-2/5 -translate-x-1/2 rounded-t-full pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 80%, transparent 100%)",
          filter: "blur(1.5px)",
        }}
      />
      <span
        className="absolute inset-0 z-0 rounded-full pointer-events-none"
        style={{
          boxShadow:
            "0 0 0 2px rgba(255,255,255,0.10) inset, 0 1.5px 0 0 rgba(255,255,255,0.18) inset, 0 -2px 8px 0 rgba(6, 182, 212, 0.18) inset",
        }}
      />
    </button>
  );
}