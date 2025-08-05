export default function LegalLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">{title}</h1>
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700">
          {children}
        </div>
      </div>
    </div>
  )
}
