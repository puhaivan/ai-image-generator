function ClosingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1 right-1 text-gray-500 hover:text-gray-800 text-xl cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-md"
      aria-label="Close"
    >
      ✖
    </button>
  )
}

export default ClosingButton
