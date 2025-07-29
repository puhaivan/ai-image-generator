import Input from '../components/input/Input'
import Button from '../components/button/Button'
import Spinner from '../components/spinner/spinner'
import { COUNTRY_CODES } from '../utils/constants'

function Registration({
  formValues,
  setFormValues,
  formErrors,
  selectedCountryCode,
  setSelectedCountryCode,
  onSubmit,
  switchAuthType,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formErrors.general && (
        <div className="text-red-500 text-sm text-center mb-2">{formErrors.general}</div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="text"
          placeholder="Email"
          value={formValues.email.value}
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
        <label className="text-sm font-medium text-gray-700">Phone Number</label>
        <div className="flex gap-2">
          <select
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            className="w-24 border border-gray-300 rounded-md px-2 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COUNTRY_CODES.map((code) => (
              <option key={code.value} value={code.value}>
                {code.label}
              </option>
            ))}
          </select>

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
            className="flex-1"
          />
        </div>
        {formErrors.phoneNumber && (
          <span className="text-red-500 text-xs">{formErrors.phoneNumber.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">First Name</label>
        <Input
          placeholder="First Name"
          value={formValues.firstName.value}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              firstName: {
                ...prev.firstName,
                value: e.target.value,
              },
            }))
          }
        />
        {formErrors.firstName && (
          <span className="text-red-500 text-xs">{formErrors.firstName.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Last Name</label>
        <Input
          placeholder="Last Name"
          value={formValues.lastName.value}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              lastName: {
                ...prev.lastName,
                value: e.target.value,
              },
            }))
          }
        />
        {formErrors.lastName && (
          <span className="text-red-500 text-xs">{formErrors.lastName.message}</span>
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
          <span className="text-red-500 text-xs">{formErrors.password.message}</span>
        )}
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner size={4} color="blue" message="" />
          </div>
        ) : (
          'Register'
        )}
      </Button>

      <button
        type="button"
        className="text-sm text-blue-600 underline mt-2"
        onClick={switchAuthType}
      >
        Already have an account? Login
      </button>
    </form>
  )
}

export default Registration
