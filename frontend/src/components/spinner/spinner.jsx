function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 border-[5px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500 animate-pulse">Generating image...</p>
    </div>
  )
}

export default Spinner
