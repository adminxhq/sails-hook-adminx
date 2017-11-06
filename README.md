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
/**
 * Car.js
 *
 * @description :: Motorized vehicle with 4 wheels for individual and family transport
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  /* SailsJS schema configuration
   * Mandatory for SailsJS framework */
  attributes: {
    model: { type:'string' },
    brand: { model: 'brand' },
    year: { type: 'integer', min: 2000, max: 2019 },
    dailyRate: { type: 'float', min: 0 },
    availableAt: { type: 'date' },
    fullTank: { type: 'boolean' },
    summary: { type: 'mediumtext' },
    thumbnail: { type: 'string' },
    cover: { type: 'string' },
    extras: { type: 'array' },
    doorConfiguration: {
      type: 'string',
      enum: ['2 Doors', '3 Doors', '4 Doors', '5 Doors', '6 Doors']
    },
    history: { type: 'longtext' },
    metaData: { type: 'json' },
  },

  /* AdminX configuration
   * This configuration is optional
   * Here you can define how AdminX
   * displays and helps you edit your data */
  adminx: {
    name: 'Car',
    attributes: {
      id: { disabled: true },
      thumbnail: { list: true, editor: 'image' },
      brand: { }, // Here for ordering
      model: { list: true },
      summary: { }, // Here for ordering
      cover: { editor: 'image' },
      history: { editor: 'html-simple' },
      updatedAt: { list: true },
    }
  }
};
```

![AdminX Panel](https://adminx.io/web/images/app-animations/desktop-landscape.gif?v2)


### Resources
- [Documentation](https://adminx.io/docs) for reference on AdminX configuration.
- [Support](https://adminx.io/support)
- [Live Demo](https://adminx.io/demo)
- [Sails Demo Code](http://github.com/adminxhq/sails-demo)

