import Input from '../components/input/Input'
import Button from '../components/button/Button'


function Login({ formValues, setFormValues, formErrors, onSubmit, switchAuthType }) {
  return (
    
    <form onSubmit={onSubmit} className="space-y-4">
        {formErrors.general && (
  <div className="text-red-500 text-sm text-center mb-2">
    {formErrors.general}
  </div>
)}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Phone Number</label>
        <Input
          placeholder="Phone Number"
          value={formValues.phoneNumber.value}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              phoneNumber: {
                ...prev.phoneNumber,
                value: e.target.value,
              },
            }))
          }
        />
        {formErrors.phoneNumber && (
  <span className="text-red-500 text-sm">
    {typeof formErrors.phoneNumber === 'string'
      ? formErrors.phoneNumber
      : formErrors.phoneNumber.message}
  </span>
)}
        
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          placeholder="Password"
          value={formValues.password.value}
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
  <span className="text-red-500 text-sm">
    {typeof formErrors.password === 'string'
      ? formErrors.password
      : formErrors.password.message}
  </span>
)}
      </div>

      <Button type="submit" fullWidth>Login</Button>
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
