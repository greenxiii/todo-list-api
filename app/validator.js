var Validator = {
  isEmail: function(val) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
  },
  isUndefined: function(val) {
    return (typeof val === 'undefined');
  },
  isNull: function(val) {
    return (val == null);
  },
  isEmptyString: function(val) {
    return /^$/.test(val);
  }
};

function VObject(obj, pName, isOptional) {
  this.prop = {
    name: pName,
    value: obj[pName],
    isOptional: !!isOptional
  };
  this.errors = [];
}

VObject.create = function(obj, pName, isOptional) {
  return new VObject(obj, pName, isOptional);
};

VObject.prototype.isEmail = function(message) {
  this.check({
    condition: Validator.isEmail(this.prop.value),
    message: message,
    defaultMessage: 'Should be valid email address'
  });
  return this;
};

VObject.prototype.notBlank = function(message) {
  this.check({
    condition: !(Validator.isUndefined(this.prop.value) ||
      Validator.isNull(this.prop.value) ||
      Validator.isEmptyString(this.prop.value)),
    message: message,
    defaultMessage: 'Can\'t be blank'
  });
  return this;
};

VObject.analyzeArray = function(arr) {
  var result = {};
  arr.forEach(function(el) {
    if (el.errors.length > 0) {
      result[el.prop.name] = el.errors;
    }
  });

  if (Object.keys(result).length > 0) {
    return {
      valid: false,
      errors: result
    };
  }

  return {
    valid: true
  };
};

VObject.prototype.check = function(params) {
  if (!params.condition && (!this.prop.isOptional ||
      (this.prop.isOptional && !Validator.isUndefined(this.prop.value)))) {
    if (params.message) {
      this.errors.push(params.message);
    } else {
      this.errors.push(params.defaultMessage);
    }
  }
};

var routesRules = {
  'users:create': function(req) {
    return [
      VObject.create(req.body, 'email').notBlank().isEmail(),
      VObject.create(req.body, 'firstName').notBlank(),
      VObject.create(req.body, 'lastName').notBlank(),
      VObject.create(req.body, 'password').notBlank()
    ];
  },

  'auth:login': function(req) {
    return [
      VObject.create(req.body, 'email').notBlank().isEmail(),
      VObject.create(req.body, 'password').notBlank()
    ];
  },

  'projects:create': function(req) {
    return [
      VObject.create(req.body, 'title').notBlank()
    ];
  },

  'projects:edit': function(req) {
    return [
      VObject.create(req.body, 'title').notBlank()
    ];
  },

  'tasks:create': function(req) {
    return [
      VObject.create(req.body, 'title').notBlank()
    ];
  },


  'tasks:edit': function(req) {
    return [
      VObject.create(req.body, 'title').notBlank()
    ];
  }
};

var getValidator = function(route) {
  return function(req, res, next) {
    var vRequest = VObject.analyzeArray(routesRules[route](req));
    if (vRequest.valid) {
      next();
    } else {
      res.status(400).send({
        message: vRequest.errors
      });
      return false;
    }
  };
};

module.exports = getValidator;