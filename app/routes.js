const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Sign in
router.post('/sign-in-answer', function (req, res) {
  var email = req.session.data['email']
  var password = req.session.data['password']
  var errors = {}
  if (!email) errors['email'] = 'Enter your email address'
  if (!password) errors['password'] = 'Enter your password'
  if (Object.keys(errors).length > 0) {
    req.session.data['errors'] = errors
    return res.redirect('/sign-in')
  }
  req.session.data['errors'] = {}
  res.redirect('/date-of-birth')
})

// Date of birth - full validation
router.post('/dob-answer', function (req, res) {
  var day = req.session.data['dob-day']
  var month = req.session.data['dob-month']
  var year = req.session.data['dob-year']
  var errors = {}
  var dayInt = parseInt(day)
  var monthInt = parseInt(month)
  var yearInt = parseInt(year)
  var currentYear = new Date().getFullYear()

  if (!day && !month && !year) {
    errors['dob'] = 'Enter your date of birth'
  } else if (!day && !month) {
    errors['dob'] = 'Date of birth must include a day and month'
  } else if (!day && !year) {
    errors['dob'] = 'Date of birth must include a day and year'
  } else if (!month && !year) {
    errors['dob'] = 'Date of birth must include a month and year'
  } else if (!day) {
    errors['dob'] = 'Date of birth must include a day'
  } else if (!month) {
    errors['dob'] = 'Date of birth must include a month'
  } else if (!year) {
    errors['dob'] = 'Date of birth must include a year'
  } else if (year.length !== 4 || isNaN(yearInt)) {
    errors['dob'] = 'Year must be 4 numbers, for example 2007'
  } else if (isNaN(dayInt) || dayInt < 1 || dayInt > 31) {
    errors['dob'] = 'Day must be a real day, for example 15'
  } else if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
    errors['dob'] = 'Month must be a real month, for example 3'
  } else if (yearInt < 1900 || yearInt > currentYear) {
    errors['dob'] = 'Enter a real date of birth'
  } else {
    var testDate = new Date(yearInt, monthInt - 1, dayInt)
    if (testDate.getMonth() !== monthInt - 1) {
      errors['dob'] = 'Enter a real date of birth'
    }
  }

  if (Object.keys(errors).length > 0) {
    req.session.data['errors'] = errors
    return res.redirect('/date-of-birth')
  }

  req.session.data['errors'] = {}
  var today = new Date()
  var dob = new Date(yearInt, monthInt - 1, dayInt)
  var ageMs = today - dob
  var ageDate = new Date(ageMs)
  var years = Math.abs(ageDate.getUTCFullYear() - 1970)
  var months = ageDate.getUTCMonth()
  var totalMonths = (years * 12) + months
  if (totalMonths < ((15 * 12) + 9)) {
    return res.redirect('/too-young')
  }
  res.redirect('/residency')
})

// Residency
router.post('/residency-answer', function (req, res) {
  var residency = req.session.data['residency']
  if (!residency) {
    req.session.data['errors'] = { 'residency': 'Select where you live' }
    return res.redirect('/residency')
  }
  req.session.data['errors'] = {}
  if (residency === 'yes') {
    res.redirect('/eyesight')
  } else {
    res.redirect('/not-eligible-residency')
  }
})

// Eyesight
router.post('/eyesight-answer', function (req, res) {
  var eyesight = req.session.data['eyesight']
  if (!eyesight) {
    req.session.data['errors'] = { 'eyesight': 'Select whether you can read a number plate from 20 metres' }
    return res.redirect('/eyesight')
  }
  req.session.data['errors'] = {}
  res.redirect('/medical-conditions')
})

// Medical conditions
router.post('/medical-answer', function (req, res) {
  var medical = req.session.data['medical-conditions']
  if (!medical) {
    req.session.data['errors'] = { 'medical-conditions': 'Select yes if you have a medical condition that may affect your driving' }
    return res.redirect('/medical-conditions')
  }
  req.session.data['errors'] = {}
  if (medical === 'yes') {
    res.redirect('/medical-declare')
  } else {
    res.redirect('/vehicle-type')
  }
})

// Medical declare
router.post('/medical-declare-answer', function (req, res) {
  var declared = req.session.data['medical-declare']
  if (!declared || declared.length === 0) {
    req.session.data['errors'] = { 'medical-declare': 'Select the conditions you want to declare' }
    return res.redirect('/medical-declare')
  }
  req.session.data['errors'] = {}
  res.redirect('/vehicle-type')
})

// Vehicle type
router.post('/vehicle-type-answer', function (req, res) {
  var vehicleType = req.session.data['vehicle-type']
  if (!vehicleType || vehicleType.length === 0) {
    req.session.data['errors'] = { 'vehicle-type': 'Select at least one vehicle type' }
    return res.redirect('/vehicle-type')
  }
  req.session.data['errors'] = {}
  res.redirect('/personal-name')
})

// Name
router.post('/name-answer', function (req, res) {
  var firstName = req.session.data['first-name']
  var lastName = req.session.data['last-name']
  var errors = {}
  if (!firstName) errors['first-name'] = 'Enter your first name'
  if (!lastName) errors['last-name'] = 'Enter your last name'
  if (Object.keys(errors).length > 0) {
    req.session.data['errors'] = errors
    return res.redirect('/personal-name')
  }
  req.session.data['errors'] = {}
  res.redirect('/ni-number')
})

// NI number - optional
router.post('/ni-answer', function (req, res) {
  req.session.data['errors'] = {}
  res.redirect('/address-current')
})

// Current address
router.post('/address-answer', function (req, res) {
  var line1 = req.session.data['address-line1']
  var town = req.session.data['address-town']
  var postcode = req.session.data['address-postcode']
  var errors = {}
  if (!line1) errors['address-line1'] = 'Enter the first line of your address'
  if (!town) errors['address-town'] = 'Enter your town or city'
  if (!postcode) {
    errors['address-postcode'] = 'Enter your postcode'
  } else if (!/^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i.test(postcode.trim())) {
    errors['address-postcode'] = 'Enter a real postcode, for example SW1A 1AA'
  }
  if (Object.keys(errors).length > 0) {
    req.session.data['errors'] = errors
    return res.redirect('/address-current')
  }
  req.session.data['errors'] = {}
  res.redirect('/address-previous-check')
})

// Previous address check
router.post('/previous-address-answer', function (req, res) {
  var prevAddress = req.session.data['previous-address']
  if (!prevAddress) {
    req.session.data['errors'] = { 'previous-address': 'Select yes if you have lived at another address in the last 3 years' }
    return res.redirect('/address-previous-check')
  }
  req.session.data['errors'] = {}
  res.redirect('/identity')
})

// Identity method
router.post('/identity-answer', function (req, res) {
  var method = req.session.data['identity-method']
  if (!method) {
    req.session.data['errors'] = { 'identity-method': 'Select how you want to prove your identity' }
    return res.redirect('/identity')
  }
  req.session.data['errors'] = {}
  if (method === 'passport') {
    res.redirect('/passport')
  } else {
    res.redirect('/post-documents')
  }
})

// Passport details
router.post('/passport-answer', function (req, res) {
  var number = (req.session.data['passport-number'] || '').replace(/\s/g, '')
  var expiryDay = req.session.data['passport-expiry-day']
  var expiryMonth = req.session.data['passport-expiry-month']
  var expiryYear = req.session.data['passport-expiry-year']
  var errors = {}

  if (!number) {
    errors['passport-number'] = 'Enter your passport number'
  } else if (number.length !== 9) {
    errors['passport-number'] = 'Passport number must be 9 characters, for example 012345678'
  }

  var expiryDayInt = parseInt(expiryDay)
  var expiryMonthInt = parseInt(expiryMonth)
  var expiryYearInt = parseInt(expiryYear)

  if (!expiryDay && !expiryMonth && !expiryYear) {
    errors['passport-expiry'] = 'Enter your passport expiry date'
  } else if (!expiryDay) {
    errors['passport-expiry'] = 'Passport expiry date must include a day'
  } else if (!expiryMonth) {
    errors['passport-expiry'] = 'Passport expiry date must include a month'
  } else if (!expiryYear) {
    errors['passport-expiry'] = 'Passport expiry date must include a year'
  } else if (expiryYear.length !== 4 || isNaN(expiryYearInt)) {
    errors['passport-expiry'] = 'Expiry year must be 4 numbers, for example 2030'
  } else if (isNaN(expiryDayInt) || expiryDayInt < 1 || expiryDayInt > 31) {
    errors['passport-expiry'] = 'Expiry day must be a real day, for example 15'
  } else if (isNaN(expiryMonthInt) || expiryMonthInt < 1 || expiryMonthInt > 12) {
    errors['passport-expiry'] = 'Expiry month must be a real month, for example 3'
  } else {
    var testDate = new Date(expiryYearInt, expiryMonthInt - 1, expiryDayInt)
    if (testDate.getMonth() !== expiryMonthInt - 1) {
      errors['passport-expiry'] = 'Enter a real expiry date'
    }
  }

  if (Object.keys(errors).length > 0) {
    req.session.data['errors'] = errors
    return res.redirect('/passport')
  }
  req.session.data['errors'] = {}
  res.redirect('/check-answers')
})

// Post documents confirmation
router.post('/identity-post-confirm', function (req, res) {
  req.session.data['errors'] = {}
  res.redirect('/check-answers')
})

// Payment
router.post('/payment-answer', function (req, res) {
  var cardName = req.session.data['card-name']
  var cardNumber = req.session.data['card-number']
  var errors = {}
  if (!cardName) errors['card-name'] = 'Enter the name on the card'
  if (!cardNumber) {
    errors['card-number'] = 'Enter the card number'
  } else if (!/^[0-9]{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
    errors['card-number'] = 'Enter a valid card number'
  }
  if (Object.keys(errors).length > 0) {
    req.session.data['errors'] = errors
    return res.redirect('/payment')
  }
  req.session.data['errors'] = {}
  res.redirect('/confirmation')
})

module.exports = router