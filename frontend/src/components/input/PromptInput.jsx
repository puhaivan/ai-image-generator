

function PromptInput({ label, value, onChange, placeholder, ...rest }) {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1 text-sm  font-medium">{label}</label>}
      <input
        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  )
}

export default PromptInput

