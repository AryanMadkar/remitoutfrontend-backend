// components/application/FormField.jsx
export default function FormField({ label, icon, children, required }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      {children}
    </div>
  );
}