export default function SegmentedControl({ options, value, onChange, label, className = '' }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`inline-flex p-1 gap-1 rounded-xl border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 ${className}`}
    >
      {options.map(opt => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            style={isActive && opt.activeColor ? { background: opt.activeColor } : undefined}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              isActive
                ? `${opt.activeColor ? '' : 'bg-lavender'} text-warm-800 dark:text-dark-900 font-semibold`
                : 'text-warm-500 dark:text-dark-300 hover:bg-warm-50 dark:hover:bg-dark-600'
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
