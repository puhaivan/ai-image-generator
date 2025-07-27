import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/')
  }, [navigate])

  return <p className="text-center mt-10">Signing you in...</p>
}

export default AuthSuccess
