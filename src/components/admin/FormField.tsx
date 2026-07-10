import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, required, error, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white",
        "placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors",
        error
          ? "border-red-400 dark:border-red-600"
          : "border-neutral-200 dark:border-neutral-700",
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

export function Select({ error, options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors",
        error
          ? "border-red-400 dark:border-red-600"
          : "border-neutral-200 dark:border-neutral-700",
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white",
        "placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-y min-h-[80px]",
        error
          ? "border-red-400 dark:border-red-600"
          : "border-neutral-200 dark:border-neutral-700",
        className
      )}
      {...props}
    />
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer select-none", className)}>
      <input
        type="checkbox"
        className="w-4 h-4 accent-indigo-600 rounded"
        {...props}
      />
      <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
    </label>
  );
}
