import { cn } from "@/lib/utils";

export interface FieldProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
}

export function Field({ label, className, children, ...props }: FieldProps) {
  return (
    <label
      className={cn("flex flex-col rounded-[9px] bg-card px-3 py-2", className)}
      {...props}
    >
      <span className="text-[8px] font-bold uppercase tracking-wide text-[#77859a]">{label}</span>
      {children}
    </label>
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full border-0 bg-transparent pt-1.5 text-[11px] text-[#22314a] outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function TextInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full border-0 bg-transparent pt-1.5 text-[11px] text-[#22314a] outline-none placeholder:text-[#929eb0]",
        className,
      )}
      {...props}
    />
  );
}
