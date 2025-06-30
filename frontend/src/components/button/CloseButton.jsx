function CloseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-0 right-0 text-gray-500 hover:text-gray-800 text-xl cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-md"
      aria-label="Close"
    >
      ✖
    </button>
  )
}

export default CloseButton
