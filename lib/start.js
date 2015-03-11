'use strict';

var Bluebird = require('bluebird');
var parseMeta = require('./util/parse-meta');
var REGEX = require('./util/regex');


module.exports = function (proto) {

  proto.start = function () {
    return this
      .containers()
      .bind(this)
      .then(function (containers) {
        if (containers.length && containers[0].version === this.opts.meta.version) {
          if (REGEX.UP.test(containers[0].Status)) {
            return containers[0];
          } else {
            return this.docker.getContainer(containers[0].Id).startAsync();
          }
        } else {
          return this.docker.createContainerAsync(parseMeta(this.opts.meta));
        }
      })
      .then(this.containers)
      .get(0);
  };

};