import { useState } from 'react'
import Button from '../button/Button'
import CloseButton from '../button/closeButton'
import userPanelIcon from '/images/user-panel-icon.svg'
import ChangePassword from '../../pages/ChangePassword'
import Modal from '../modal/Modal'

const MobileUserPanel = ({ open, setOpen, user, handleLogout }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  if (!user) return null
  return (
    <>
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <ChangePassword onClose={() => setShowPasswordModal(false)} />
        </Modal>
      )}
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-4 z-40 transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <img src={userPanelIcon} className="w-4 h-4" alt="Trash Icon" />
            <span>User Panel</span>
          </h2>
          <CloseButton className="w-5 h-5 text-gray-700" onClick={() => setOpen(false)} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-inner">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-sm">
              {user?.firstName || user?.name || 'Guest'}
            </div>
            <div>
              <p className="text-gray-600 text-sm">👋 Welcome,</p>
              <p className="text-blue-800 font-semibold text-sm">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          {user.method === 'local' ? (
            <Button onClick={() => setShowPasswordModal(true)} className="my-3">
              Change Password
            </Button>
          ) : (
            <p className="text-sm text-gray-600 italic my-3">🔐 Logged with Google</p>
          )}
          <Button
            onClick={() => {
              setOpen(false)
              handleLogout()
            }}
            variant="danger"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}

export default MobileUserPanel
