export const FORM_FIELDS = {
  PHONE: 'phoneNumber',
  PASSWORD: 'password',
  FIRSTNAME: 'firstName',
  LASTNAME: 'lastName',
  EMAIL: 'email',
}

const getValidationRule = (field) => {
  const rules = {
    [FORM_FIELDS.PHONE]: {
      value: /^\d{7,12}$/,
      message: 'Phone number must be between 7 and 12 digits',
    },
    [FORM_FIELDS.PASSWORD]: {
      value: /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/,
      message: 'Password must be at least 6 characters and include a letter and a number',
    },
    newPassword: {
      value: /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/,
      message: 'Password must be at least 6 characters and include a letter and a number',
    },
    code: {
      value: /^\d{6}$/,
      message: 'Reset code must be exactly 6 digits',
    },
    [FORM_FIELDS.FIRSTNAME]: {
      value: /^[a-zA-Z]{4,}$/,
      message: 'Name must contain at least 4 letters and only letters',
    },
    [FORM_FIELDS.LASTNAME]: {
      value: /^[a-zA-Z]{4,}$/,
      message: 'Last name must contain at least 4 letters and only letters',
    },
    [FORM_FIELDS.EMAIL]: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Enter a valid email address',
    },
  }

  return rules[field]
}

export const validate = (values, errors = {}) => {
  for (const key in values) {
    const { value, required } = values[key]
    const rule = getValidationRule(key)

    if (required && (!value || value.trim() === '')) {
      errors[key] = { message: 'This field is required' }
    } else if (rule && value && !rule.value.test(value)) {
      errors[key] = { message: rule.message }
    } else {
      delete errors[key]
    }
  }

  return errors
}
