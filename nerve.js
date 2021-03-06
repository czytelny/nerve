"use strict";

var nerve = (function () {
    var DEFAULT_ROUTE = "root";
    // issue #1: routes should be object instead of array as per usage below.
    var routes = {};

    function findSubscriber(callReference, array) {
        if (!array)
            return null;

        var i = 0, len = array.length;
        for (; i < len; i++) {
            if (array[i].callee === callReference)
                return array[i];
        }

        return null;
    }

    function isString(object) {
        return (typeof object === 'string' || object instanceof String);
    }



    return {

        on: function (channel, route, callback, scope) {
            /// <summary>Listen to a given channel or listen to a channel and route combination</summary>
            /// <param name="channel" type="String">The category of a an event</param>
            /// <param name="route" optional="true" type="String">The sub category of an event</param>
            /// <param name="callback" type="Function">A callback to to handle the event</param>
            /// <param name="scope" type="Function">The scope reference you are calling about</param>

            var c = channel, r = null, cb = null, caller = null;
            if (arguments.length == 1) {
                throw Error('A channel and a callback must be specified');
            } else if (arguments.length == 2) {
                if (Object.prototype.toString.call(arguments[1]) == "[object Function]") {
                    cb = arguments[1];
                    caller = arguments.callee;
                }
            } else if (arguments.length == 3 && Object.prototype.toString.call(arguments[2]) == "[object Function]") {
                // issue #1: arguments[1] was being checked as the funciton, but [1] should be the route.
                // issue #1: r was not being set and shoudl be the arguments[1] or route parameter.
                if (Object.prototype.toString.call(arguments[2]) == "[object Function]") {
                    r = arguments[1];
                    cb = arguments[2];
                    caller = arguments[3] || arguments.callee;
                } else {
                    throw Error('Last parameter must be a callback function');
                }
            } else if (arguments.length == 4) {
                c = channel;
                r = route;
                cb = callback;

                caller = scope || arguments.callee;
            }

            if (!cb) {
                return;
            }

            if (!routes[channel]) {
                //--- check on route
                routes[channel] = [];
            }

            if (!r) {
                r = DEFAULT_ROUTE;
            }

            if (r && !routes[channel][r]) {
                routes[channel][r] = [];
            }


            //--- check to make sure we aren't adding ourselves twice
            if (findSubscriber(caller, routes[channel][r]))
                return;

            routes[channel][r].push({
                callee: caller,
                callback: cb
            });

        },

        off: function (channel, route, scope) {
            if (routes[channel]) {
                var r = DEFAULT_ROUTE, caller = scope || arguments.callee;

                if (route) r = route;

                if (!routes[channel][r]) return;

                var i = 0, len = routes[channel][r].length;
                for (; i < len; i++) {
                    if (routes[channel][r][i].callee === caller)
                        delete routes[channel][r][i];
                }
            }
        },

        send: function (channel, route, tObject) {
            var r = DEFAULT_ROUTE, transferObject = null;

            var argLength = arguments.length;
            if (argLength === 0) {
                throw Error('A channel must be specified');
            }

            if (argLength === 2) {
                if (isString(arguments[1])) {
                    r = arguments[1];
                } else
                    transferObject = arguments[1];
            }

            else if (arguments.length == 3) {
                r = route;
                transferObject = tObject;
            }

            if (!routes[channel] || !routes[channel][r]) {
                return;
            }

            var listeners = routes[channel][r], len = listeners.length;

            for (var i = 0; i < len; i++) {
                routes[channel][r][i].callback(transferObject);
            }
        },

        getRoutes: function() {
            return routes;
        }
    };
}
)();
