export const FORM_FIELDS = {
  PHONE: 'phoneNumber',
  PASSWORD: 'password',
  FIRSTNAME: 'firstName',
  LASTNAME: 'lastName',
}

const getValidationRule = (field) => {
  const rules = {
    [FORM_FIELDS.PHONE]: {
     value: /^\d{7,12}$/,
     message: 'Phone number must be between 7 and 12 digits',
    },
    [FORM_FIELDS.PASSWORD]: {
      value: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){6,}$/,
      message: 'Password must be at least 6 characters and include a letter and a number',
    },
    [FORM_FIELDS.FIRSTNAME]: {
      value: /^[a-zA-Z]{4,}$/,
      message: 'Name must contain at least 4 letters and only letters',
    },
    [FORM_FIELDS.LASTNAME]: {
      value: /^[a-zA-Z]{4,}$/,
      message: 'Last name must contain at least 4 letters and only letters',
    },
  }

  return rules[field]
}

export const validate = (values, errors = {}) => {
  Object.keys(values).map((key) => {
    const { value, required } = values[key]
    const rule = getValidationRule(key)

    if (required && !value) {
      errors[key] = { message: 'This field is required' }
    } else if (rule && !rule.value.test(value)) {
      errors[key] = { message: rule.message }
    } else {
      delete errors[key]
    }

    return null
  })

  return errors
}
