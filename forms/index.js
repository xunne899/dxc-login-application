//caolan-forms
const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;


const createUserForm = () => {
    return forms.create({
      username: fields.string({
        required: true,
        errorAfterField: true,
  
      }),
      email: fields.string({
        required: true,
        errorAfterField: true,
        validators: [validators.email(), validators.maxlength(200)],
  
      }),
    });
  };

  const createLoginForm = () => {
    return forms.create({
      email: fields.string({
        required: true,
        errorAfterField: true,
        validators: [validators.email(), validators.maxlength(320)],
      }),
      password: fields.password({
        required: true,
        errorAfterField: true,
  
      }),
    });
  };

  module.exports = {
    createLoginForm,
    createUserForm,
    bootstrapField,
  };