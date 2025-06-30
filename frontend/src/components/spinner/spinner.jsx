function Spinner({ size = 12, color = 'blue-500', message = 'Generating image...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`border-[5px] border-${color} border-t-transparent rounded-full animate-spin`}
        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      />
      <p className="text-sm text-gray-500 animate-pulse">{message}</p>
    </div>
  )
}

export default Spinner
