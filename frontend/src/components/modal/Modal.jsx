import ClosingButton from '../button/CloseButton'

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ">
      <div className="bg-white/90 p-4 rounded-lg shadow-xl max-w-lg w-full relative m-4 sm:m-0">
        <ClosingButton onClick={onClose} />
        {children}
      </div>
    </div>
  )
}

export default Modal
