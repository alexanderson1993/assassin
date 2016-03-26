// Options
AccountsTemplates.configure({
    // defaultLayout: 'emptyLayout',
    showForgotPasswordLink:false,
    overrideLoginErrors:false,
    enablePasswordChange:false,
    sendVerificationEmail:false,

    // enforceEmailVerification: true,
    confirmPassword:true,
    continuousValidation:false,
    forbidClientAccountCreation:false,
    // formValidationFeedback: true,
    // homeRoutePath: '/',
    showAddRemoveServices:false,
    showPlaceholders:false,

    negativeValidation:true,
    positiveValidation:true,
    negativeFeedback:false,
    positiveFeedback:true,

    // Privacy Policy and Terms of Use
    // privacyUrl: 'privacy',
    // termsUrl: 'terms-of-use',
});

AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');

