
let apiEndpoint = 'https://hammerhead-app-wf3r9.ondigitalocean.app';

var registerForm = document.querySelector('.js-register-form');

if (registerForm) {
  var formContainer = registerForm.querySelector('.register-form__inner')
  var formSubmitBtn = registerForm.querySelector('.register-form__submit')
  var languageInput = registerForm.querySelector('[name="custom[language]"]')

  if (languageInput) {
    function handleWeglotLang() {
      if (typeof window.Weglot !== 'undefined') {
        const langCode = window.Weglot.getCurrentLang() || 'en'
        console.log(window.Weglot.getCurrentLang())
        languageInput.value = langCode
      } else {
        setTimeout(handleWeglotLang, 250)
      }
    }

    handleWeglotLang();
  }

  // registerForm.querySelectorAll('select[name="address[country]"]').forEach(element => {
  //   var id = element.id
  //   var province = registerForm.querySelector('select[name="address[province]"]')
  //   var provinceID = province.id
  //   var provinceHolderID = province.closest('.form__input-wrapper').id

  //   return new Shopify.CountryProvinceSelector(id, provinceID, {
  //     hideElement: provinceHolderID
  //   })
  // })

  var vatCheckbox = registerForm.querySelector('#show-vat')
  var vatField = registerForm.querySelector('#register-vat')
  var vatFieldContainer = registerForm.querySelector('#vat-field-container')
  var validateVatBtn = registerForm.querySelector('.js-validate-vat')
  var vatErrorMessage = registerForm.querySelector('.register-form__vat-error')

  vatCheckbox.addEventListener('change', function () {
    if (this.checked) {
      vatFieldContainer.classList.add('js-active')
    } else {
      vatFieldContainer.classList.remove('js-active')
    }
  })

  vatField.addEventListener('change', function (event) {
    validateVatBtn.disabled = false
    validateVatBtn.classList.remove('js-success')
    validateVatBtn.classList.remove('js-error')
  })

  if (validateVatBtn) {
    validateVatBtn.addEventListener('click', function () {
      validateVatBtn.classList.add('js-loading')
      validateVatBtn.disabled = true

      validateVat(vatField.value)
        .then(function (res) {
          console.log(res)
          validateVatBtn.classList.remove('js-loading')

          if (!res.isValid || !res.isValidFormat) {
            validateVatBtn.classList.add('js-error')
            vatErrorMessage.style.display = 'block';
          } else if (res.isValid) {
            validateVatBtn.classList.add('js-success')
            vatErrorMessage.style.display = 'none';
          }
        })
        .catch(function (error) {
          console.log('catch error', error);
        })
    })
  }

  var checkboxGroups = registerForm.querySelectorAll('.js-checkbox-group.js-required')

  checkboxGroups.forEach(function (group) {
    initCheckboxValidation(group);
  })

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault()


    if (languageInput) {
      handleWeglotLang();
    }

    if (!vatCheckbox.checked) {
      submitRequest()
      return
    }

    validateVat(vatField.value)
      .then(function (res) {
        if (!res.isValid || !res.isValidFormat) {
          validateVatBtn.classList.add('js-error')
          vatErrorMessage.style.display = 'block';

          vatCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });

          return
        }

        submitRequest()
      })
      .catch(function (error) {
        console.log('catch error', error);
      })

    function submitRequest() {
      var formData = new FormData(event.target);
      let formController = 'registerForm'

      if (event.target.classList.contains('js-register-form--update')) {
        formController = 'updateForm'
      }

      fetch(`${apiEndpoint}/api/${formController}`, {
        method: "POST",
        credentials: "same-origin",
        body: formData,
        headers: {
          "ContentType": "multipart/form-data"
        }
      }).then((response) => {
        if (response.ok) return response.json();

        return response.text().then(response => { throw new Error(response) })
      })
        .then((data) => {
          if (registerForm.getAttribute('data-redirect') && registerForm.getAttribute('data-redirect') !== "") {
            const redirectURL = registerForm.getAttribute('data-redirect');
            window.open(redirectURL, "_self")
          } else {
            if (formController == 'registerForm') {
              var successMessage = registerForm.querySelector('.register-form__message--success')

              formContainer.style.display = 'none'
              successMessage.style.display = 'block'

              successMessage.scrollIntoView({ behavior: 'instant', block: 'center' });
            } else {
              formSubmitBtn.classList.remove('js-loading')
              formSubmitBtn.classList.add('js-success')
            }
          }

        }).catch((error) => {
          console.log(error)

          if (formController == 'registerForm') {
            let errorMessage;
            if (error.message === 'Email already in use!') {
              errorMessage = registerForm.querySelector('.register-form__message--error-email')
            } else {
              errorMessage = registerForm.querySelector('.register-form__message--error')
            }
            formContainer.style.display = 'none'
            errorMessage.style.display = 'block'
            errorMessage.scrollIntoView({ behavior: 'instant', block: 'center' });
          } else {
            formSubmitBtn.classList.remove('js-loading')
            formSubmitBtn.classList.add('js-error')
            console.log('else')

            var errorMessage = registerForm.querySelector('.register-form__submit-error')
            errorMessage.style.display = 'block'
            errorMessage.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        });
    }
  })


  function validateVat(vatNumber) {
    return fetch(`${apiEndpoint}/api/validateVat`, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        vat: vatNumber
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      if (response.ok) {
        return response.json()
      }

      return Promise.reject(Error('error'))
    }).catch(error => {
      return Promise.reject(Error(error.message))
    })
  }

  function initCheckboxValidation(group) {
    var checkboxes = group.querySelectorAll('input[type=checkbox]');
    var checkboxLength = checkboxes.length;
    var firstCheckbox = checkboxLength > 0 ? checkboxes[0] : null;

    if (firstCheckbox) {
      for (let i = 0; i < checkboxLength; i++) {
        checkboxes[i].addEventListener('change', function () {
          var errorMessage = !isChecked(checkboxLength, checkboxes) ? 'At least one checkbox must be selected.' : '';
          firstCheckbox.setCustomValidity(errorMessage);
        });
      }

      isChecked(checkboxLength, checkboxes)

      var errorMessage = !isChecked(checkboxLength, checkboxes) ? 'At least one checkbox must be selected.' : '';
      firstCheckbox.setCustomValidity(errorMessage);
    }
  }

  function isChecked(checkboxLength, checkboxes) {
    for (let i = 0; i < checkboxLength; i++) {
      if (checkboxes[i].checked) return true;
    }

    return false;
  }
}