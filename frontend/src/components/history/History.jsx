function History({ history, onClick }) {
  return (
   <div className="max-w-4xl mx-auto mt-12 ">
  <h2 className="text-2xl font-semibold text-center text-gray-800 border-b pb-2 mb-6">🕘 Your History</h2>

  {history.length === 0 ? (
    <p className="text-center text-gray-500 italic">No images generated yet. Start creating!</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
      {history.map((item, index) => {
  const generationDate = new Date(item.createdAt).toLocaleString()

  return (
    <div
      key={index}
      onClick={() => onClick(item)}
      className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg cursor-pointer transition duration-200"
    >
      <img
        src={item.url}
        alt={`Image ${index + 1}`}
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <p className="text-sm text-gray-700 truncate">{item.prompt}</p>
        <p className="text-xs text-gray-400 mt-1">{generationDate}</p>
      </div>
    </div>
  )
})}
    </div>
  )}
</div>

  )
}

export default History
