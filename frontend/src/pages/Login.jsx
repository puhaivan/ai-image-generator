import Input from '../components/input/Input'
import Button from '../components/button/Button'
import { API_BASE_URL } from '../utils/constants'

function Login({ formValues, setFormValues, formErrors, onSubmit, switchAuthType }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {formErrors.general && (
        <div className="text-red-500 text-sm text-center mb-2">{formErrors.general}</div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Email"
          value={formValues.email?.value || ''}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              email: {
                ...prev.email,
                value: e.target.value,
              },
            }))
          }
        />
        {formErrors.email && (
          <span className="text-red-500 text-xs">{formErrors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          placeholder="Password"
          value={formValues.password?.value || ''}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              password: {
                ...prev.password,
                value: e.target.value,
              },
            }))
          }
        />
        {formErrors.password && (
          <span className="text-red-500 text-xs">
            {typeof formErrors.password === 'string'
              ? formErrors.password
              : formErrors.password.message}
          </span>
        )}
      </div>

      <Button type="submit" fullWidth>
        Login
      </Button>

      <div className="relative">
        <div className="my-2 border-t border-gray-300" />
        <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white px-2 text-xs text-gray-400">
          or
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          window.location.href = `${API_BASE_URL}/auth/google`
        }}
        className="flex items-center justify-center w-full border border-gray-300 rounded-md bg-white text-gray-700 font-medium px-4 py-2 hover:shadow-md transition"
      >
        <img src="/images/google-icon.svg" alt="Google" className="h-5 w-5 mr-3" />
        <span className="text-sm">Sign in with Google</span>
      </button>

      <button
        type="button"
        className="text-sm text-blue-600 underline mt-2"
        onClick={switchAuthType}
      >
        Don’t have an account? Register
      </button>
    </form>
  )
}

export default Login
