# sails-hook-adminx [![Build Status](https://travis-ci.org/adminxhq/sails-hook-adminx.svg?branch=master)](https://travis-ci.org/adminxhq/sails-hook-adminx)
> Sails hook for AdminX. Manage your sails app data without coding.

### What's AdminX?
[AdminX](https://adminx.io) is a universal, fast and reliable admin panel.

### Try it with the [Live Demo](https://adminx.io/demo)

### Sample app
We open sourced the demo app we use on the website:
[Sails Demo Code](http://github.com/adminxhq/sails-demo)

### Requirements
- sails 0.12
- Waterline: this integrations requires you to use the default Sails ORM

### What does this sails hook do?
1. Initializes on `sails lift` as the `sails-hook-adminx`
2. Exposes a REST API under `/adminx/*`
3. Adds CORS (Cross Origin Resource Sharing) configuration to open access from AdminX servers (https://adminx.io)

An AdminX Panel is then able to connect to your server securely.

### Install
```console
# npm install sails-hook-adminx --save
yarn add sails-hook-adminx
```

### Configure
Create a `config/adminx.js` file

```javascript
/**
 * AdminX Configuration
 * (sails.config.adminx)
 *
 * Configure settings for AdminX
 *
 */
module.exports.adminx = {
  
  // Ignores the authentication, for development purposes only
  authEnabled: true,
  
  //Go to AdminX site and configure a new Data Auth Token
  dataAuthToken: 'REPLACE_THIS_TOKEN'
};
```

### Usage
In your models, you can now define an `adminx` attribute with the adminx configurations you need.
```javascript

```

### Resources
- [Live Demo](https://adminx.io/demo)
- [Sails Demo Code](http://github.com/adminxhq/sails-demo) for a working demo.
- [Documentation](https://adminx.io/docs/0.0/) for up to date documentation.
- [Support](https://adminx.io/support)
