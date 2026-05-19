const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// -----------------------------------------------
// DVLA Provisional Driving Licence Prototype
// Full route branching based on actual DVLA flow
// -----------------------------------------------

// Sign in - always proceed (in a real service this would authenticate)
router.post('/sign-in-answer', function (req, res) {
  res.redirect('/date-of-birth')
})

// Age check - born too recently means ineligible
// Must be 15y9m old. We simplify: check year of birth is < (current year - 15)
router.post('/dob-answer', function (req, res) {
  var year = parseInt(req.session.data['dob-year'])
  var month = parseInt(req.session.data['dob-month'])
  var day = parseInt(req.session.data['dob-day'])

  if (!year || !month || !day) {
    res.redirect('/date-of-birth')
    return
  }

  var today = new Date()
  var dob = new Date(year, month - 1, day)

  // Calculate age in years and months
  var ageMs = today - dob
  var ageDate = new Date(ageMs)
  var years = Math.abs(ageDate.getUTCFullYear() - 1970)
  var months = ageDate.getUTCMonth()

  // Must be at least 15 years and 9 months
  var totalMonths = (years * 12) + months
  var minimumMonths = (15 * 12) + 9

  if (totalMonths < minimumMonths) {
    res.redirect('/too-young')
  } else {
    res.redirect('/residency')
  }
})

// Residency check
router.post('/residency-answer', function (req, res) {
  var residency = req.session.data['residency']
  if (residency === 'yes') {
    res.redirect('/eyesight')
  } else {
    res.redirect('/not-eligible-residency')
  }
})

// Eyesight check
router.post('/eyesight-answer', function (req, res) {
  var eyesight = req.session.data['eyesight']
  if (eyesight === 'no') {
    // In a real service this would be more nuanced - redirect to guidance
    res.redirect('/medical-conditions')
  } else {
    res.redirect('/medical-conditions')
  }
})

// Medical conditions - branch to declaration page or skip straight to vehicle type
router.post('/medical-answer', function (req, res) {
  var medical = req.session.data['medical-conditions']
  if (medical === 'yes') {
    res.redirect('/medical-declare')
  } else {
    res.redirect('/vehicle-type')
  }
})

// Medical declaration - always proceed to vehicle type
router.post('/medical-declare-answer', function (req, res) {
  res.redirect('/vehicle-type')
})

// Vehicle type - proceed to personal details
router.post('/vehicle-type-answer', function (req, res) {
  res.redirect('/personal-name')
})

// Name - proceed to NI number
router.post('/name-answer', function (req, res) {
  res.redirect('/ni-number')
})

// NI number - proceed to address
router.post('/ni-answer', function (req, res) {
  res.redirect('/address-current')
})

// Current address - proceed to previous address check
router.post('/address-answer', function (req, res) {
  res.redirect('/address-previous-check')
})

// Previous address - if yes go to previous address entry; if no go to identity
router.post('/previous-address-answer', function (req, res) {
  var prevAddress = req.session.data['previous-address']
  if (prevAddress === 'yes') {
    // In a full prototype you would loop through multiple previous addresses
    // For this prototype we go straight to identity
    res.redirect('/identity')
  } else {
    res.redirect('/identity')
  }
})

// Identity method selection - branch based on document type
router.post('/identity-answer', function (req, res) {
  var method = req.session.data['identity-method']
  if (method === 'passport') {
    res.redirect('/passport')
  } else {
    // Non-passport: show post documents warning page
    res.redirect('/post-documents')
  }
})

// Passport details - proceed to check answers
router.post('/passport-answer', function (req, res) {
  res.redirect('/check-answers')
})

// Post documents confirmation - proceed to check answers
router.post('/identity-post-confirm', function (req, res) {
  res.redirect('/check-answers')
})

// Payment - proceed to confirmation
router.post('/payment-answer', function (req, res) {
  res.redirect('/confirmation')
})

module.exports = router
