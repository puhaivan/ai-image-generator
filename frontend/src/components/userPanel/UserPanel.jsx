import { useState } from 'react'
import Button from '../button/Button'
import userPanelIcon from '/images/user-panel-icon.svg'
import ChangePassword from '../modal/ChangePasswordModal'
import Modal from '../modal/Modal'

const UserPanel = ({ user, handleLogout }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  if (!user) return null

  return (
    <>
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <ChangePassword onClose={() => setShowPasswordModal(false)} />
        </Modal>
      )}
      <div className="fixed top-5/13 left-4 -translate-y-1/2 z-40 w-64 bg-white shadow-lg rounded-lg border p-4 hidden lg:block transition-transform duration-300 ease-in-out">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <img src={userPanelIcon} className="w-4 h-4" alt="Trash Icon" />
          <span>User Panel</span>
        </h2>

        {user && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-inner mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm">
              {user?.firstName || user?.name || 'Guest'}
            </div>
            <div className="text-sm">
              <p className="text-gray-600">👋 Welcome,</p>
              <p className="font-semibold text-blue-800">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
        )}
        {user.method === 'local' ? (
          <Button onClick={() => setShowPasswordModal(true)} className="my-3">
            Change Password
          </Button>
        ) : (
          <p className="text-sm text-gray-600 italic my-3">🔐 Logged with Google</p>
        )}
        <Button onClick={handleLogout} variant="danger" className="w-full">
          Logout
        </Button>
      </div>
    </>
  )
}

export default UserPanel
