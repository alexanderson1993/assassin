Package.describe({
  summary: 'Accounts Templates styled for Twitter Bootstrap.',
  version: '1.11.1',
  name: 'useraccounts:bootstrap',
  git: 'https://github.com/meteor-useraccounts/bootstrap.git',
});

Package.on_use(function(api, where) {
  api.versionsFrom('METEOR@1.0');

  api.use([
    'templating',
    'underscore',
  ], 'client');

  api.use([
    'useraccounts:core',
  ], ['client', 'server']);

  // Requires all routing packages loads before this asking for weak dependencies.
  api.use('useraccounts:flow-routing@1.12.1', ['client', 'server'], {weak: true});
  api.use('useraccounts:iron-routing@1.12.1', ['client', 'server'], {weak: true});

  api.imply([
    'useraccounts:core@1.12.4',
  ], ['client', 'server']);

  api.add_files([
    'lib/at_bootstrap.css'
  ], ['client']);
});

Package.on_test(function(api) {
  api.use([
    'useraccounts:bootstrap',
    'useraccounts:core@1.12.4',
  ]);

  api.use([
    'accounts-password',
    'tinytest',
    'test-helpers'
  ], ['client', 'server']);

  api.add_files([
    'tests/tests.js'
  ], ['client', 'server']);
});
