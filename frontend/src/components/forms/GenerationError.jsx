import errorIcon from '/images/trash-bin-icon.svg'

function GenerationError({ error }) {
  return (
    <div className="max-w-xl mx-auto mt-4 px-4">
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
        <img src={errorIcon} alt="Error" className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    </div>
  )
}

export default GenerationError
