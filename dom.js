/**
 * Copyright © 2015 STRG.AT GmbH, Vienna, Austria
 *
 * This file is part of the The SCORE Framework.
 *
 * The SCORE Framework and all its parts are free software: you can redistribute
 * them and/or modify them under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation which is in the
 * file named COPYING.LESSER.txt.
 *
 * The SCORE Framework and all its parts are distributed without any WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. For more details see the GNU Lesser General Public
 * License.
 *
 * If you have not received a copy of the GNU Lesser General Public License see
 * http://www.gnu.org/licenses/.
 *
 * The License-Agreement realised between you as Licensee and STRG.AT GmbH as
 * Licenser including the issue of its valid conclusion and its pre- and
 * post-contractual effects is governed by the laws of Austria. Any disputes
 * concerning this License-Agreement including the issue of its valid conclusion
 * and its pre- and post-contractual effects are exclusively decided by the
 * competent court, in whose district STRG.AT GmbH has its registered seat, at
 * the discretion of STRG.AT GmbH also the competent court, in whose district the
 * Licensee has his registered seat, an establishment or assets.
 */

// Universal Module Loader
// https://github.com/umdjs/umd
// https://github.com/umdjs/umd/blob/v1.0.0/returnExports.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['score.init'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        factory(require('score.init'));
    } else {
        // Browser globals (root is window)
        factory(root.score);
    }
})(this, function(score) {

    score.extend('dom', [], function() {

        var i, j, result, tmp,

            matches = ['matches', 'webkitMatchesSelector', 'msMatchesSelector'].filter(function(func) {
                return func in document.documentElement;
            })[0],

            dom = function(arg) {
                result = Object.create(dom.proto);
                if (arg) {
                    if (Array.isArray(arg)) {
                        result.concat(arg);
                    } else if (typeof arg == 'object') {
                        result.push(arg);
                    } else {
                        tmp = dom.queryGlobal(arg);
                        for (i = tmp.length - 1; i >= 0; i--) {
                            result.push(tmp[i]);
                        }
                    }
                }
                return result;
            };

        dom.proto = Object.create(Array.prototype, {

            matches: {value: function(selector) {
                for (i = 0; i < this.length; i++) {
                    if (!dom.testMatch(this[i], selector)) {
                        return false;
                    }
                }
                return true;
            }},

            empty: {value: function() {
                return !this.length;
            }},

            clone: {value: function() {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    result.push(this[i].cloneNode(true));
                }
                return result;
            }},

            children: {value: function(selector) {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    tmp = this[i].children;
                    for (j = 0; j < tmp.length; j++) {
                        if (!selector || dom.testMatch(tmp[j], selector)) {
                            result.push(tmp[j]);
                        }
                    }
                }
                return result;
            }},

            down: {value: function(selector) {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    tmp = dom.queryLocal(this[i], selector);
                    for (j = 0; j < tmp.length; j++) {
                        result.push(tmp[j]);
                    }
                }
                return result;
            }},

            parent: {value: function(selector) {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    tmp = this[i].parentNode;
                    if (!selector || dom.testMatch(tmp, selector)) {
                        result.push(tmp);
                    }
                }
                return result;
            }},

            up: {value: function(selector) {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    tmp = this[i].parentNode;
                    if (!selector || dom.testMatch(tmp, selector)) {
                        result.push(tmp);
                    }
                }
                return result;
            }}

        });

        dom.queryGlobal = document.querySelectorAll.bind(document);

        dom.queryLocal = function(root, selector) {
            return root.querySelectorAll(selector);
        };

        dom.testMatch = function(node, selector) {
            return node[matches](selector);
        };

        return dom;

    });

});
