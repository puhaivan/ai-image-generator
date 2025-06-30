
  function Button({ children, onClick, type, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 w-full rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 transition"
    >
      {children}
    </button>
  )
}

export default Button
