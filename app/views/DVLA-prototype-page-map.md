# DVLA Provisional Driving Licence - Prototype Page Map

## Service name
"Apply for your first provisional driving licence"

## Fee
£34 online | £43 by post

---

## Full page flow

| Step | File | Route in | Route out | Branch? |
|------|------|----------|-----------|---------|
| 1 | start.html | /start | /sign-in | No |
| 2 | sign-in.html | /sign-in | /date-of-birth | No (always passes in prototype) |
| 3 | date-of-birth.html | /date-of-birth | /dob-answer POST | Yes |
| - | too-young.html | - | dead end | - |
| 4 | residency.html | /residency | /residency-answer POST | Yes |
| - | not-eligible-residency.html | - | dead end | - |
| 5 | eyesight.html | /eyesight | /eyesight-answer POST | No (in prototype, always continues) |
| 6 | medical-conditions.html | /medical-conditions | /medical-answer POST | Yes |
| 6a | medical-declare.html | /medical-declare | /medical-declare-answer POST | No |
| 7 | vehicle-type.html | /vehicle-type | /vehicle-type-answer POST | No |
| 8 | personal-name.html | /personal-name | /name-answer POST | No |
| 9 | ni-number.html | /ni-number | /ni-answer POST | No |
| 10 | address-current.html | /address-current | /address-answer POST | No |
| 11 | address-previous-check.html | /address-previous-check | /previous-address-answer POST | Loop (simplified) |
| 12 | identity.html | /identity | /identity-answer POST | Yes |
| 12a | passport.html | /passport | /passport-answer POST | - |
| 12b | post-documents.html | /post-documents | /identity-post-confirm POST | - |
| 13 | check-answers.html | /check-answers | /payment GET | No |
| 14 | payment.html | /payment | /payment-answer POST | No |
| 15 | confirmation.html | /confirmation | - | - |

---

## Key branching rules (from verified DVLA process)

### Age gate (step 3)
- Minimum: 15 years 9 months to APPLY
- Cannot drive a car until 17 (or 16 with enhanced PIP)
- Cannot drive a moped until 16
- Branch: under 15y9m -> /too-young

### Residency gate (step 4)
- Must live in England, Scotland or Wales
- Northern Ireland = DVA not DVLA
- Outside UK = ineligible
- Branch: non-GB -> /not-eligible-residency

### Medical declaration (step 6)
- If "yes" -> /medical-declare (checkboxes for specific conditions)
- If "no" -> skip to /vehicle-type
- Conditions that MUST be declared: epilepsy, heart conditions, insulin-treated diabetes, significant visual impairment, sleep apnoea, mental health, neurological conditions
- Failure to declare = criminal offence, fine up to £1,000

### Identity method (step 12)
- UK passport -> /passport (photo pulled automatically from HMRC/passport office, NO separate photo required)
- Any other document -> /post-documents (must mail originals to DVLA, Swansea, SA99 1AD)

### Confirmation page conditional content
- Non-passport: shows warning to post documents within 5 working days
- Medical declared: shows note that GP checks may delay processing

---

## What the first prototype was missing (vs real DVLA flow)
1. No GOV.UK sign-in / account creation step
2. No age eligibility check (just asked for name)
3. No residency check
4. No eyesight check
5. No medical declaration
6. No vehicle category selection
7. No National Insurance number step
8. No 3-year address history
9. No identity document choice (passport vs alternatives)
10. No post-documents warning for non-passport applicants
11. No payment step (real service: £34 card payment)
12. No conditional confirmation content based on journey taken

---

## Files created
- app/views/start.html
- app/views/sign-in.html
- app/views/date-of-birth.html
- app/views/too-young.html
- app/views/residency.html
- app/views/not-eligible-residency.html
- app/views/eyesight.html
- app/views/medical-conditions.html
- app/views/medical-declare.html
- app/views/vehicle-type.html
- app/views/personal-name.html
- app/views/ni-number.html
- app/views/address-current.html
- app/views/address-previous-check.html
- app/views/identity.html
- app/views/passport.html
- app/views/post-documents.html
- app/views/check-answers.html
- app/views/payment.html
- app/views/confirmation.html
- app/routes.js (full branching logic with age calculation)
- app/config.json

---

## How to use these files

1. Create a new prototype folder: `npx govuk-prototype-kit@latest create`
2. Replace `app/routes.js` with this file
3. Replace `app/config.json` with this file
4. Copy all `.html` files into `app/views/`
5. Run `npm run dev` and open `http://localhost:3000/start`

## Test paths to walk through
- Happy path: GB resident, 17+, UK passport, no medical conditions, car
- Too young path: DOB within last 15y9m -> /too-young
- NI path: residency = Northern Ireland -> /not-eligible-residency
- Medical path: medical conditions = yes -> /medical-declare
- Non-passport path: identity = birth certificate -> /post-documents -> conditional warning on confirmation
