function Input({ label, value, onChange, placeholder, className = '', error, ...rest }) {
  return (
    <div className={`flex flex-col ${label ? 'mb-4' : ''}`}>
      {label && <label className="mb-1 text-sm font-medium">{label}</label>}

      <input
        className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 transition 
          ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'} ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  )
}

export default Input
