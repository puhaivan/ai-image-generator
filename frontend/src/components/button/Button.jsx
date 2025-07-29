function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
}) {
  const baseStyle = `px-4 py-2 w-full rounded text-white transition duration-200 hover:shadow-md`
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-500 hover:bg-red-600',
    disabled: 'bg-gray-400 cursor-not-allowed',
  }

  const variantStyle = disabled ? variants.disabled : variants[variant] || variants.primary

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} cursor-pointer ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
