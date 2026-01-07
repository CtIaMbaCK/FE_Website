interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ label, checked, onChange, disabled = false }: ToggleProps) {
  return (
    <label className={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        className="sr-only peer"
        value=""
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className="
        relative w-9 h-5 rounded-full peer 
        bg-gray-200 
        peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 
        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
        peer-checked:after:border-white 
        after:content-[''] after:absolute after:top-0.5 after:start-0.5 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-4 after:w-4 after:transition-all 
        peer-checked:bg-primary
      "></div>
      {label && (
        <span className="select-none ms-3 text-sm font-medium text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
}