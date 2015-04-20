"use strict";
angular.module("momotrip", ["ngCookies", "ngTouch", "ngSanitize", "ui.router", "ngRoute", "ui.bootstrap", "LocalStorageModule", "facebook", "angles", "ui.bootstrap-slider", "angularMoment", "ngRoute", "ngMap"]).value("cfg", {
        proxyurl: "http://momotrip.linkupstudios.com/api"
    }).config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "FacebookProvider", function(o, a, i, n) {
        i.interceptors.push(["$log", "$q", function(o, a) {
            return {
                request: function(o) {
                    return o
                },
                response: function(a) {
                    return o.info(a), a
                },
                responseError: function(i) {
                    return o.warn(i), a.reject(i)
                }
            }
        }]), o.state("home", {
            url: "/",
            templateUrl: "partials/main.html",
            controller: "MainCtrl"
        }).state("deals", {
            url: "/deals",
            templateUrl: "partials/deals.html"
        }).state("guides", {
            url: "/guides",
            templateUrl: "partials/guides.html"
        }).state("flight", {
            url: "/flight",
            templateUrl: "partials/flight.html",
            controller: "FlightCtrl"
        }).state("hotel", {
            url: "/hotel",
            templateUrl: "partials/hotel.html",
            controller: "HotelCtrl"
        }).state("hotel.detail", {
            url: "/detail/{path:.*}",
            templateUrl: "partials/hotel.detail.html",
            controller: "HotelDetailCtrl"
        }).state("dashboard", {
            url: "/dashboard",
            templateUrl: "partials/dashboard.html",
            controller: "DashboardCtrl"
        }), a.otherwise("/"), i.defaults.useXDomain = !0, i.defaults.withCredentials = !1, n.init("1530828237134524")
    }]).run(["amMoment", function(o) {
        o.changeLocale("id")
    }]), angular.module("momotrip").controller("MainCtrl", ["$rootScope", "$scope", "$window", "$location", "$state", "$timeout", "FlightService", "HotelService", function(o, a, i, n, e, t, l, s) {
        a.searchFlightOpt = function(o) {
            switch (o) {
                case "oneway":
                    a.selectreturn = !1, a.selectpricegraph = !1;
                    break;
                case "roundtrip":
                    a.selectreturn = !0, a.selectpricegraph = !1;
                    break;
                case "pricegraph":
                    a.selectreturn = !1, a.selectpricegraph = !0;
                    break;
                default:
                    a.selectreturn = !1, a.selectpricegraph = !1
            }
        };
        var r = function() {
            l.getAirports().then(function(o) {
                a.airports = o.data
            }, function() {})
        };
        r(), a.start = new Date, a.end = new Date, a.minStartDate = a.start, a.minEndDate = a.start, a.$watch("flight.date", function(o) {
            a.minEndDate = o
        }), a.openStart = function() {
            t(function() {
                a.openedddate = !0
            })
        }, a.openEnd = function() {
            t(function() {
                a.openedrdate = !0
            })
        }, a.dateOptions = {
            showWeeks: !1,
            formatYear: "yy",
            formatDay: "d",
            startingDay: 1
        }, a.searchFlight = function() {
            l.setSearchParams(a.flight), e.go("flight")
        }, a.resetSearch = function() {
            a.flightsearched = !1, a.displaySearchForm = !0
        }, a.hotelKeyword = function(o) {
            return s.searchHotelKeyword(o).then(function(o) {
                return o.data.map(function(o) {
                    return o.value
                })
            }, function() {})
        }, a.hotelStart = new Date, a.hotelEnd = new Date, a.hotelMinStartDate = a.hotelStart, a.hotelMinEndDate = a.hotelStart, a.$watch("hotel.startdate", function(o) {
            a.hotelMinEndDate = o
        }), a.hotelOpenStart = function() {
            t(function() {
                a.hotelOpenStartDate = !0
            })
        }, a.hotelOpenEnd = function() {
            t(function() {
                a.hotelOpenEndDate = !0
            })
        }, a.searchHotel = function() {
            s.setSearchParams(a.hotel), e.go("hotel")
        }
    }]), angular.module("momotrip").controller("NavbarCtrl", ["$log", "$scope", "$rootScope", "$timeout", "UserService", function(o, a, i, n, e) {
        a.logged = e.isLogged(), a.logged && (a.user = e.getUser()), a.$on("user:loggedin", function() {
            a.logged = !0, a.user = e.getUser()
        }), a.$on("user:loggedout", function() {
            a.logged = !1, e.delUser()
        }), a.doLogin = function(n) {
            a.loading = !0, e.login(n).then(function(n) {
                if (a.loading = !1, 0 == n.error) {
                    o.info();
                    var t = {
                        id: n.data._id.$id,
                        email: n.data.email,
                        title: n.data.title,
                        firstname: n.data.firstname,
                        lastname: n.data.lastname,
                        phone: n.data.phone
                    };
                    e.setUser(t), a.modalLogin = !1, i.$broadcast("user:loggedin", t)
                } else a.loginmessage = "invalid user or password"
            })
        }, a.doRegister = function(n) {
            a.loading = !0, e.register(n).then(function(n) {
                if (0 == n.error) {
                    var t = {
                        id: n.data._id.$id,
                        email: n.data.email,
                        password: n.data.password
                    };
                    e.setUser(t), a.modalLogin = !1, i.$broadcast("user:loggedin", t)
                } else a.registermessage = "error register user", o.info(a.registermessage), a.modalLogin = !1
            })
        }, a.doLogout = function() {
            i.$broadcast("user:loggedout", a.user)
        }, a.doForgetPass = function(i) {
            a.loading = !0, e.resetPass(i).then(function(i) {
                a.forgetpassmessage = 0 == i.error ? "password sudah direset, silahkan cek email" : "maaf password tidak bisa direset, silahkan coba beberapa saat lagi", n(function() {
                    a.modalLogin = !1
                }, 1e3), a.loading = !1, o.info(a.forgetpassmessage)
            })
        }, a.doChangePass = function(n) {
            a.loading = !0, e.changePass(n).then(function(n) {
                if (0 == n.error) {
                    var t = {
                        id: n.data._id.$id,
                        password: n.data.password
                    };
                    e.setUser(t)
                } else a.changepassmessage = "error register user", o.info(a.changepassmessage)
            })
        }, a.modalLogin = !1, a.toggleLogin = function() {
            a.modalLogin = !a.modalLogin
        }, a.$on("user:clicklogin", function() {
            a.modalLogin = !0
        })
    }]), angular.module("momotrip").controller("FlightCtrl", ["$scope", "$rootScope", "$location", "$anchorScroll", "$log", "$state", "$timeout", "FlightService", "UserService", function(o, a, i, n, e, t, l, s, r) {
        o.logged = r.isLogged(), o.logged && (o.user = r.getUser()), o.$on("user:loggedin", function() {
            o.logged = !0, o.user = r.getUser(), angular.isDefined(o.order) && (angular.isDefined(o.user.title) && (o.order.conSalutation = o.user.title), angular.isDefined(o.user.firstname) && (o.order.conFirstName = o.user.firstname), angular.isDefined(o.user.lastname) && (o.order.conLastName = o.user.lastname), angular.isDefined(o.user.phone) && (o.order.conPhone = o.user.phone), o.order.conEmailAddress = o.user.email)
        }), o.$on("user:loggedout", function() {
            o.logged = !1, r.delUser()
        });
        var p = function(a) {
            o.loading = !0, s.searchFlight(a).then(function(a) {
                o.$broadcast("flight:search", a)
            }, function(a, i) {
                o.flightSearchResult = i, o.loading = !1
            })
        };
        o.$on("flight:search:new", function(a, i) {
            o.graphDepartures = !1, o.flightresultdep = !1, o.flightresultret = !1, o.noresult = !1, o.searchParams = s.getSearchParams(), p(i)
        }), o.searchParams = s.getSearchParams(), angular.isDefined(s.getSearchParams()) ? p(s.getSearchParams()) : o.loading = !1, o.changeDate = function(a, i) {
            e.info("search again using different date " + a + " " + i);
            var n = {};
            "dep" === a && (n.date = i, n.ret_date = o.searchParams.ret_date, o.returnflight = !1), "ret" === a && (n.ret_date = i, n.date = o.searchParams.ret_date), n.arr = o.searchParams.arr, n.dep = o.searchParams.dep, n.adult = o.searchParams.adult, n.child = o.searchParams.child, n.infant = o.searchParams.infant, e.info(o.searchParams), s.setSearchParams(n), o.$broadcast("flight:search:new", n)
        }, o.$on("flight:search", function(a, i) {
            o.loading = !1, angular.isDefined(i.data.departures) && i.data.departures.length > 0 ? (o.$broadcast("flight:search:result", i), o.flightresultdep = i.data.departures, angular.isDefined(i.data.returns) && (o.flightresultret = i.data.returns), angular.isDefined(i.data.departures) && (o.bestdeals = i.data.bestdeals), o.filterAirlines = i.data.airlines, o.filterStops = ["Nonstop", "1 Stop"]) : (o.$broadcast("flight:search:noResult"), o.noresult = !0)
        }), o.$on("flight:search:result", function(a, i) {
            o.graphDepartures = i.data.pricegraph.departures, o.graphReturns = i.data.pricegraph.returns, o.filterValueAirlines = [], o.toggleAirlines = function(a) {
                var i = $.inArray(a, o.filterValueAirlines);
                i > -1 ? o.filterValueAirlines.splice(i, 1) : o.filterValueAirlines.push(a)
            }, o.filterValueStops = [], o.toggleStops = function(a) {
                var i = $.inArray(a, o.filterValueStops);
                i > -1 ? o.filterValueStops.splice(i, 1) : o.filterValueStops.push(a)
            }
        }), o.selectFlight = function(a, i) {
            o.summary = !0, "dep" === a && (angular.isArray(o.flightresultret) ? o.departure = i : (o.departure = i, s.scrollTo("sum"))), "ret" === a && (o.returnflight = i, s.scrollTo("sum")), "bestdeals" === a && (angular.isDefined(o.bestdeals.departures) && (o.departure = o.bestdeals.departures), angular.isDefined(o.bestdeals.returns) && (o.returnflight = o.bestdeals.returns), s.scrollTo("sum"))
        }, o.confirmFlight = function() {
            if (angular.isDefined(o.departure)) {
                s.scrollTo("top"), o.graphDepartures = !1, o.flightresultdep = !1, o.flightresultret = !1, o.noresult = !1, o.stepFillData = !0, o.order = {}, o.order.flight_id = o.departure.flight_id, angular.isDefined(o.returnflight) && (o.order.ret_flight_id = o.returnflight.flight_id), o.order.adult = o.searchParams.adult, o.order.child = o.searchParams.child;
                var a = o.searchParams.adult;
                if (parseInt(a) > 0) {
                    o.adults = [];
                    for (var i = 0; a > i; i++) o.adults.push(i)
                }
                var n = o.searchParams.child;
                if (parseInt(n) > 0) {
                    o.childs = [];
                    for (var t = 0; n > t; t++) o.childs.push(t)
                }
                var l = o.searchParams.infant;
                if (parseInt(l) > 0) {
                    o.infants = [];
                    for (var r = 0; l > r; r++) o.infants.push(r)
                }
                o.logged && (angular.isDefined(o.user.title) && (o.order.conSalutation = o.user.title), angular.isDefined(o.user.firstname) && (o.order.conFirstName = o.user.firstname), angular.isDefined(o.user.lastname) && (o.order.conLastName = o.user.lastname), angular.isDefined(o.user.phone) && (o.order.conPhone = o.user.phone), o.order.conEmailAddress = o.user.email)
            } else e.info("no departure flight selected")
        }, o.clickLogin = function() {
            a.$broadcast("user:clicklogin")
        }, o.birthdates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], o.birthmonths = [{
            key: "01",
            name: "January"
        }, {
            key: "02",
            name: "February"
        }, {
            key: "03",
            name: "March"
        }, {
            key: "04",
            name: "April"
        }, {
            key: "05",
            name: "May"
        }, {
            key: "06",
            name: "June"
        }, {
            key: "07",
            name: "July"
        }, {
            key: "08",
            name: "August"
        }, {
            key: "09",
            name: "September"
        }, {
            key: "10",
            name: "October"
        }, {
            key: "11",
            name: "November"
        }, {
            key: "12",
            name: "December"
        }];
        var u = (new Date).getFullYear();
        o.birthyears = [];
        for (var d = 1910; u >= d; ++d) o.birthyears.push(d);
        o.addOrder = function() {
            o.summary = !0, o.loading = !0, o.stepFillData = !1, o.stepConfirm = !0;
            var a = s.orderFlight(o.order);
            a.then(function(a) {
                o.loading = !1, angular.isDefined(a.error) && a.error === !1 ? o.orderresponse = a.data : (o.ordererror = !0, o.orderresponse = !1)
            }, function(a) {
                o.loading = !1, o.orderresponse = a, o.ordererror = !0
            })
        }, o.checkout = function() {
            if (angular.isDefined(o.orderresponse)) {
                o.loading = !0;
                var a = {
                        orderid: o.orderresponse.myorder.order_id,
                        salutation: o.order.conSalutation,
                        firstName: o.order.conFirstName,
                        lastName: o.order.conLastName,
                        phone: o.order.conPhone,
                        emailAddress: o.order.conEmailAddress
                    },
                    i = s.checkout(a);
                i.then(function(a) {
                    o.loading = !1, o.paymentstatus = a, angular.isDefined(a.diagnostic.status) && 200 == a.diagnostic.status ? o.paymentstatus = a : o.ordererror = !0
                }, function() {
                    o.loading = !1, o.ordererror = !0
                })
            }
        }, o.searchFlightOpt = function(a) {
            switch (a) {
                case "oneway":
                    o.selectreturn = !1, o.selectpricegraph = !1;
                    break;
                case "roundtrip":
                    o.selectreturn = !0, o.selectpricegraph = !1;
                    break;
                case "pricegraph":
                    o.selectreturn = !1, o.selectpricegraph = !0;
                    break;
                default:
                    o.selectreturn = !1, o.selectpricegraph = !1
            }
        };
        var c = function() {
            s.getAirports().then(function(a) {
                o.airports = a.data
            }, function() {})
        };
        c(), o.start = new Date, o.end = new Date, o.minStartDate = o.start, o.minEndDate = o.start, o.$watch("flight.date", function(a) {
            o.minEndDate = a
        }), o.openStart = function() {
            l(function() {
                o.openedddate = !0
            })
        }, o.openEnd = function() {
            l(function() {
                o.openedrdate = !0
            })
        }, o.dateOptions = {
            showWeeks: !1,
            formatYear: "yy",
            formatDay: "d",
            startingDay: 1
        }, o.flightsearched = !1, o.displaySearchForm = !0, o.searchFlight = function() {
            s.setSearchParams(o.flight), o.searchParams = s.getSearchParams(), angular.isDefined(o.searchParams) ? p() : t.go("flight")
        }, o.highlightRow = function() {
            alert("Task Id is " + taskId)
        }, o.parseFloat = function(o) {
            return parseFloat(o)
        }, o.iAm = function() {
            o.order.firstnamea = [], o.order.lastnamea = [], o.order.titlea = [], o.order.firstnamea[1] = "", o.order.lastnamea[1] = "", o.order.titlea[1] = "", o.order.firstnamea[1] = o.order.conFirstName, o.order.lastnamea[1] = o.order.conLastName, o.order.titlea[1] = o.order.conSalutation, e.info(o.order)
        }
    }]), angular.module("momotrip").controller("HotelCtrl", ["$scope", "$location", "$anchorScroll", "$log", "$state", "$timeout", "HotelService", function(o, a, i, n, e, t, l) {
        var s = function() {
            l.searchHotel(o.searchParams).then(function(a) {
                o.$broadcast("hotel:search", a)
            }, function(a, i) {
                o.hotelSearchResult = i, o.loading = !1
            })
        };
        o.searchParams = l.getSearchParams(), o.loading = !0, angular.isDefined(o.searchParams) ? s() : (n.info("hotel detail?"), o.loading = !1, e.go("hotel.detail")), o.$on("hotel:search", function(a, i) {
            o.loading = !1, angular.isDefined(i.data) ? (o.$broadcast("hotel:search:result", i), o.hotelresult = i.data) : (o.$broadcast("hotel:search:noResult"), o.noresult = !0)
        }), o.searchHotel = function() {
            n.info("cliked"), l.setSearchParams(o.hotel), e.go("hotel"), o.searchParams = l.getSearchParams(), o.loading = !0, angular.isDefined(o.searchParams) ? s() : o.loading = !1
        }, angular.isUndefined(o.hotel) && (o.hotel = {}), o.hotelKeyword = function(o) {
            return l.searchHotelKeyword(o).then(function(o) {
                return o.data.map(function(o) {
                    return o.value
                })
            }, function() {})
        }, o.hotelStart = new Date, o.hotelEnd = new Date, o.hotelMinStartDate = o.hotelStart, o.hotelMinEndDate = o.hotelStart, o.$watch("hotel.startdate", function(a) {
            o.hotelMinEndDate = a
        }), o.hotelOpenStart = function() {
            t(function() {
                o.hotelOpenStartDate = !0
            })
        }, o.hotelOpenEnd = function() {
            t(function() {
                o.hotelOpenEndDate = !0
            })
        }, o.dateOptions = {
            showWeeks: !1,
            formatYear: "yy",
            formatDay: "d",
            startingDay: 1
        }, o.defaultPhoto = "https://www.master18.tiket.com/img/default/d/e/default-default.sq2.jpg", o.$on("mapInitialized", function(a, i) {
            o.map = i, window.setTimeout(function() {
                google.maps.event.trigger(i, "resize")
            }, 100)
        })
    }]), angular.module("momotrip").controller("HotelDetailCtrl", ["$scope", "$log", "$state", "$timeout", "$stateParams", "HotelService", function(o, a, i, n, e) {
        o.hoteldetail = "hotel detail" + e.path
    }]), angular.module("momotrip").controller("DashboardCtrl", ["$scope", "$location", "$anchorScroll", "$log", "$state", "UserService", function(o, a, i, n, e, t) {
        o.logged = t.isLogged(), o.logged ? o.user = t.getUser() : e.go("home"), o.$on("user:loggedin", function() {
            o.logged = !0, o.user = t.getUser()
        }), o.$on("user:loggedout", function() {
            o.logged = !1, e.go("home")
        })
    }]), angular.module("momotrip").service("TokenService", ["$http", "$q", "$log", "localStorageService", "cfg", function(o, a, i, n, e) {
        this.generateToken = function() {
            var i = a.defer();
            return o({
                method: "GET",
                url: e.proxyurl + "/token"
            }).success(function(o) {
                i.resolve(o)
            }).error(function(o) {
                i.reject(o)
            }), i.promise
        }, this.getToken = function() {
            var t = n.get("momotoken"),
                l = a.defer();
            return null === t ? o({
                method: "GET",
                url: e.proxyurl + "/token/json"
            }).success(function(o) {
                n.set("momotoken", o.token), l.resolve(o.token)
            }).error(function() {
                l.reject(config), i.warn("error getting token from API")
            }) : l.resolve(t), l.promise
        }, this.delToken = function() {
            return n.remove("momotoken")
        }
    }]), angular.module("momotrip").service("FlightService", ["$http", "$q", "$window", "$log", "cfg", "TokenService", function(o, a, i, n, e, t) {
        this.getAirports = function() {
            {
                var i = a.defer();
                a.defer()
            }
            return o({
                method: "GET",
                url: e.proxyurl + "/flight/airport"
            }).success(function(o, a, n) {
                i.resolve(o, a, n)
            }).error(function() {
                i.reject()
            }), i.promise
        }, this.setSearchParams = function(o) {
            this.searchparams = o
        }, this.getSearchParams = function() {
            return this.searchparams
        }, this.searchFlight = function(i) {
            var l = (a.defer(), a.defer()),
                s = new Date(i.date),
                r = (s.getMonth() + 1).toString(),
                p = s.getDate().toString();
            if (s = s.getFullYear().toString() + "-" + (r[1] ? r : "0" + r[0]) + "-" + (p[1] ? p : "0" + p[0]), i.date = s, angular.isDefined(i.ret_date)) {
                var u = new Date(i.ret_date),
                    d = (u.getMonth() + 1).toString(),
                    c = u.getDate().toString();
                u = u.getFullYear().toString() + "-" + (d[1] ? d : "0" + d[0]) + "-" + (c[1] ? c : "0" + c[0]), i.ret_date = u
            }
            var m = i.dep.split(" | ");
            i.d = m[1];
            var v = i.arr.split(" | ");
            return i.a = v[1], t.getToken().then(function(o) {
                return o
            }, function() {
                n.warn("error getting token from API")
            }).then(function(a) {
                o({
                    method: "GET",
                    url: e.proxyurl + "/flight/search",
                    headers: {
                        momotoken: a
                    },
                    params: i
                }).success(function(o, a, i) {
                    l.resolve(o, a, i)
                }).error(function() {
                    l.reject()
                })
            }, function() {
                n.warn("error getting flight result API")
            }), l.promise
        }, this.orderFlight = function(i) {
            var l = a.defer();
            return t.getToken().then(function(o) {
                return o
            }, function() {
                n.warn("error getting token from API")
            }).then(function(a) {
                o({
                    method: "POST",
                    url: e.proxyurl + "/order/flight",
                    headers: {
                        momotoken: a
                    },
                    data: i
                }).success(function(o, a, i) {
                    l.resolve(o, a, i)
                }).error(function() {
                    l.reject()
                })
            }, function() {
                n.warn("error getting flight result API")
            }), l.promise
        }, this.checkout = function(i) {
            var l = (a.defer(), a.defer());
            return t.getToken().then(function(o) {
                return o
            }, function() {
                n.warn("error getting token from API")
            }).then(function(a) {
                o({
                    method: "POST",
                    url: e.proxyurl + "/flight/checkout",
                    headers: {
                        momotoken: a
                    },
                    data: i
                }).success(function(o, a, i) {
                    l.resolve(o, a, i)
                }).error(function() {
                    l.reject()
                })
            }, function() {
                n.warn("error getting flight result API")
            }), l.promise
        }, this.scrollTo = function(o) {
            function a() {
                return self.pageYOffset ? self.pageYOffset : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0
            }

            function i(o) {
                for (var a = document.getElementById(o), i = a.offsetTop, n = a; n.offsetParent && n.offsetParent != document.body;) n = n.offsetParent, i += n.offsetTop;
                return i
            }
            var n = a(),
                e = i(o),
                t = e > n ? e - n : n - e;
            if (100 > t) return void scrollTo(0, e);
            var l = Math.round(t / 100);
            l >= 20 && (l = 20);
            var s = Math.round(t / 25),
                r = e > n ? n + s : n - s,
                p = 0;
            if (e > n)
                for (var u = n; e > u; u += s) setTimeout("window.scrollTo(0, " + r + ")", p * l), r += s, r > e && (r = e), p++;
            else
                for (var u = n; u > e; u -= s) setTimeout("window.scrollTo(0, " + r + ")", p * l), r -= s, e > r && (r = e), p++
        }
    }]), angular.module("momotrip").service("HotelService", ["$http", "$q", "$window", "$log", "cfg", "TokenService", function(o, a, i, n, e, t) {
        this.setSearchParams = function(o) {
            this.searchparams = o
        }, this.getSearchParams = function() {
            return this.searchparams
        }, this.searchHotelKeyword = function(i) {
            var l = a.defer();
            return t.getToken().then(function(o) {
                return o
            }, function() {
                n.warn("error getting token from API")
            }).then(function(a) {
                o({
                    method: "GET",
                    url: e.proxyurl + "/hotel/search/keyword",
                    headers: {
                        momotoken: a
                    },
                    params: {
                        q: i
                    }
                }).success(function(o, a, i) {
                    l.resolve(o, a, i)
                }).error(function() {
                    l.reject()
                })
            }, function() {
                n.warn("error getting hotel result API")
            }), l.promise
        }, this.getHotel = function(i) {
            var l = (a.defer(), a.defer());
            return t.getToken().then(function(o) {
                return o
            }, function() {
                n.warn("error getting token from API")
            }).then(function(a) {
                o({
                    method: "GET",
                    url: e.proxyurl + "/hotel/detail",
                    headers: {
                        momotoken: a
                    },
                    params: i
                }).success(function(o, a, i) {
                    l.resolve(o, a, i)
                }).error(function() {
                    l.reject()
                })
            }, function() {
                n.warn("error getting hotel result API")
            }), l.promise
        }, this.searchHotel = function(i) {
            var l = (a.defer(), a.defer()),
                s = new Date(i.startdate),
                r = (s.getMonth() + 1).toString(),
                p = s.getDate().toString();
            s = s.getFullYear().toString() + "-" + (r[1] ? r : "0" + r[0]) + "-" + (p[1] ? p : "0" + p[0]), i.startdate = s;
            var u = new Date(i.enddate),
                d = (u.getMonth() + 1).toString(),
                c = u.getDate().toString();
            return u = u.getFullYear().toString() + "-" + (d[1] ? d : "0" + d[0]) + "-" + (c[1] ? c : "0" + c[0]), i.enddate = u, t.getToken().then(function(o) {
                return o
            }, function() {
                n.warn("error getting token from API")
            }).then(function(a) {
                o({
                    method: "GET",
                    url: e.proxyurl + "/hotel/search",
                    headers: {
                        momotoken: a
                    },
                    params: i
                }).success(function(o, a, i) {
                    l.resolve(o, a, i)
                }).error(function() {
                    l.reject()
                })
            }, function() {
                n.warn("error getting hotel result API")
            }), l.promise
        }, this.orderHotel = function(i) {
            var l = (a.defer(), a.defer());
            return t.getToken().then(function(o) {
                return o
            }, function() {
                n.warn("error getting token from API")
            }).then(function(a) {
                o({
                    method: "POST",
                    url: e.proxyurl + "/hotel/order",
                    headers: {
                        momotoken: a
                    },
                    data: i
                }).success(function(o, a, i) {
                    l.resolve(o, a, i)
                }).error(function() {
                    l.reject()
                })
            }, function() {
                n.warn("error getting hotel result API")
            }), l.promise
        }, this.checkout = function(i) {
            var l = (a.defer(), a.defer());
            return t.getToken().then(function(o) {
                return o
            }, function() {
                n.warn("error getting token from API")
            }).then(function(a) {
                o({
                    method: "POST",
                    url: e.proxyurl + "/hotel/checkout",
                    headers: {
                        momotoken: a
                    },
                    data: i
                }).success(function(o, a, i) {
                    l.resolve(o, a, i)
                }).error(function() {
                    l.reject()
                })
            }, function() {
                n.warn("error getting hotel result API")
            }), l.promise
        }
    }]), angular.module("momotrip").service("UserService", ["$http", "$q", "$window", "$log", "localStorageService", "cfg", function(o, a, i, n, e, t) {

        this.setUser = function(o) {
            e.set("user.id", o.id), e.set("user.email", o.email), angular.isDefined(o.title) && e.set("user.title", o.title), angular.isDefined(o.firstname) && e.set("user.firstname", o.firstname), angular.isDefined(o.lastname) && e.set("user.lastname", o.lastname), angular.isDefined(o.phone) && e.set("user.phone", o.phone)
        },
        this.getUser = function() {
            return {
                id: e.get("user.id"),
                email: e.get("user.email"),
                title: e.get("user.title"),
                firstname: e.get("user.firstname"),
                lastname: e.get("user.lastname"),
                phone: e.get("user.phone")
            }
        },
        this.delUser = function() {
            e.remove("user.id"), e.remove("user.email"), e.remove("user.title"), e.remove("user.firstname"), e.remove("user.lastname"), e.remove("user.phone")
        },
        this.isLogged = function() {
            var o = e.get("user.id");
            return null !== o ? !0 : !1
        },
        this.isExist = function(i) {
            var n = a.defer();
            return o({
                method: "GET",
                url: t.proxyurl + "/users",
                params: i
            }).success(function(o, a, i) {
                n.resolve(o, a, i)
            }).error(function() {
                n.reject()
            }), n.promise
        },
        this.login = function(i) {
            var n = a.defer();
            return o({
                method: "POST",
                url: t.proxyurl + "/login",
                data: i
            }).success(function(o, a, i) {
                n.resolve(o, a, i)
            }).error(function() {
                n.reject()
            }), n.promise
        },
        this.register = function(i) {
            var n = a.defer();
            return o({
                method: "POST",
                url: t.proxyurl + "/users",
                data: i
            }).success(function(o, a, i) {
                n.resolve(o, a, i)
            }).error(function() {
                n.reject()
            }), n.promise
        },
        this.resetPass = function(i) {
            var e = a.defer();
            return this.isExist(i).then(function(o) {
                return o
            }, function() {
                n.warn("error getting user info from API")
            }).then(function(a) {
                var i = a.data[0],
                    n = i._id.$id;
                o({
                    method: "PUT",
                    url: t.proxyurl + "/users/" + n,
                    data: {
                        password: "1",
                        email: a.data.email
                    }
                }).success(function(o, a, i) {
                    e.resolve(o, a, i)
                }).error(function() {
                    e.reject()
                })
            }, function() {
                n.warn("error updating user password from API")
            }), e.promise
        }
        // this.changePass = function() {
        //     $http({
        //         method: "PUT",
        //         url: t.proxyurl + "/users/" + n,
        //         data    : $.param($scope.formData),  // pass in data as strings
        //         headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        //     })

        // }
    }]), angular.module("momotrip").filter("flightResultAirlinesFilter", ["$log", function() {
        return function(o, a) {
            if (angular.isDefined(a) && a.length > 0) {
                for (var i = [], n = 0; n < o.length; n++) {
                    var e = o[n],
                        t = $.inArray(e.airlines_name, a);
                    t >= 0 && i.push(e)
                }
                return i
            }
            return o
        }
    }]), angular.module("momotrip").filter("flightResultTimeRangeFilter", ["$log", function(o) {
        return function(a, i) {
            if (angular.isDefined(i) && i.length > 0) {
                for (var n = [], e = 0; e < a.length; e++) {
                    var t = a[e],
                        l = t.timerangestring.split(",");
                    o.info(typeof l + " " + l.length);
                    for (var s = 0; s < l.length; s++) {
                        var r = $.inArray(parseInt(l[s]), i);
                        if (r >= 0) {
                            o.info("found"), n.push(t);
                            break
                        }
                        o.info("not found")
                    }
                }
                return n
            }
            return a
        }
    }]), angular.module("momotrip").filter("flightResultTimeRangeFilterRet", ["$log", function(o) {
        return function(a, i) {
            if (angular.isDefined(i) && i.length > 0) {
                for (var n = [], e = 0; e < a.length; e++) {
                    var t = a[e],
                        l = t.timerangestring.split(",");
                    o.info(typeof l + " " + l.length);
                    for (var s = 0; s < l.length; s++) {
                        var r = $.inArray(parseInt(l[s]), i);
                        if (r >= 0) {
                            o.info("found"), n.push(t);
                            break
                        }
                        o.info("not found")
                    }
                }
                return n
            }
            return a
        }
    }]), angular.module("momotrip").filter("flightResultStopsFilter", function() {
        return function(o, a) {
            if (angular.isDefined(a) && a.length > 0) {
                for (var i = [], n = 0; n < o.length; n++) {
                    var e = o[n],
                        t = $.inArray(e.stop, a);
                    t >= 0 && i.push(e)
                }
                return i
            }
            return o
        }
    }), angular.module("momotrip").filter("flightResultBestDealFilter", function() {
        return function(o, a) {
            if (a === !0 && angular.isArray(o)) {
                for (var i = [], n = 0; n < o.length; n++) {
                    var e = o[n];
                    angular.isDefined(e.isbest) && i.push(e)
                }
                return i
            }
            return o
        }
    }), angular.module("momotrip").filter("customCurrency", ["numberFilter", function(o) {
        function a(o) {
            return !isNaN(parseFloat(o)) && isFinite(o)
        }
        return function(i, n, e, t, l) {
            if (a(i)) {
                n = "undefined" == typeof n ? "Rp" : n, e = "undefined" == typeof e ? "," : e, t = "undefined" == typeof t ? "</span>.<span>" : t, l = "undefined" != typeof l && a(l) ? l : 0, 0 > l && (l = 0);
                var s = o(i, l),
                    r = s.split(".");
                r[0] = r[0].split(",").join(t);
                var p = "<sup>" + n + "</sup><cite><span>" + r[0] + "</span></cite>";
                return 2 === r.length && (p += e + r[1]), p
            }
            return i
        }
    }]), angular.module("momotrip").directive("modal", function() {
        return {
            template: '<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">{{ title }}</h4></div><div class="modal-body" ng-transclude></div></div></div></div>',
            restrict: "E",
            transclude: !0,
            replace: !0,
            scope: !0,
            link: function(o, a, i) {
                o.title = i.title, o.$watch(i.visible, function(o) {
                    $(a).modal(o === !0 ? "show" : "hide")
                }), $(a).on("shown.bs.modal", function() {
                    o.$apply(function() {
                        o.$parent[i.visible] = !0
                    })
                }), $(a).on("hidden.bs.modal", function() {
                    o.$apply(function() {
                        o.$parent[i.visible] = !1
                    })
                })
            }
        }
    }), angular.module("momotrip").directive("focus", function() {
        return function(o, a) {
            a[0].focus()
        }
    }), angular.module("momotrip").directive("passwordMatch", [function() {
        return {
            restrict: "A",
            scope: !0,
            require: "ngModel",
            link: function(o, a, i, n) {
                var e = function() {
                    var a = o.$eval(i.ngModel),
                        n = o.$eval(i.passwordMatch);
                    return null != n ? a == n : void 0
                };
                o.$watch(e, function(o) {
                    n.$setValidity("passwordNoMatch", o)
                })
            }
        }
    }]), angular.module("momotrip").directive("emailavail", ["$q", "$http", "cfg", function(o, a, i) {
        return {
            require: "ngModel",
            link: function(n, e, t, l) {
                l.$asyncValidators.emailavail = function(n) {
                    var e = o.defer();
                    return a({
                        method: "GET",
                        url: i.proxyurl + "/users",
                        params: {
                            email: n
                        }
                    }).success(function(o) {
                        o.error === !0 ? e.resolve() : e.reject()
                    }).error(function() {
                        e.reject()
                    }), e.promise
                }
            }
        }
    }]), angular.module("momotrip").directive("emailexist", ["$q", "$http", "cfg", function(o, a, i) {
        return {
            require: "ngModel",
            link: function(n, e, t, l) {
                l.$asyncValidators.emailexist = function(n) {
                    var e = o.defer();
                    return a({
                        method: "GET",
                        url: i.proxyurl + "/users",
                        params: {
                            email: n
                        }
                    }).success(function(o) {
                        o.error === !1 ? e.resolve() : e.reject()
                    }).error(function() {
                        e.reject()
                    }), e.promise
                }
            }
        }
    }]), angular.module("momotrip").directive("compare", ["$q", "$http", "cfg", function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compare"
            },
            link: function(o, a, i, n) {
                n.$validators.compare = function(a) {
                    return a == o.otherModelValue
                }, o.$watch("otherModelValue", function() {
                    n.$validate()
                })
            }
        }
    }]), angular.module("momotrip").factory("slidePush", function() {
        var o, a;
        return a = 260, o = 150, {
            slide: function(i, n) {
                return n.toggleClass("active"), i.hasClass("spmenu-left") && (i.hasClass("spmenu-open") ? i.css("left", parseInt(i.css("left")) - a) : i.css("left", parseInt(i.css("left")) + a)), i.hasClass("spmenu-right") && (i.hasClass("spmenu-open") ? i.css("right", parseInt(i.css("right")) - a) : i.css("right", parseInt(i.css("right")) + a)), i.hasClass("spmenu-top") && (i.hasClass("spmenu-open") ? i.css("top", parseInt(i.css("top")) - o) : i.css("top", parseInt(i.css("top")) + o)), i.hasClass("spmenu-bottom") && (i.hasClass("spmenu-open") ? i.css("bottom", parseInt(i.css("bottom")) - o) : i.css("bottom", parseInt(i.css("bottom")) + o)), i.toggleClass("spmenu-open")
            },
            slideForceClose: function(i, n) {
                return i.hasClass("spmenu-open") ? (n.removeClass("active"), i.hasClass("spmenu-left") && i.css("left", parseInt(i.css("left")) - a), i.hasClass("spmenu-right") && i.css("right", parseInt(i.css("right")) - a), i.hasClass("spmenu-top") && i.css("top", parseInt(i.css("top")) - o), i.hasClass("spmenu-bottom") && i.css("bottom", parseInt(i.css("bottom")) - o), i.removeClass("spmenu-open")) : void 0
            },
            push: function(i, n) {
                var e, t, l;
                return e = angular.element("body"), n.toggleClass("active"), i.hasClass("spmenu-left") && (t = parseInt(e.css("left")), t = t ? t : 0, i.hasClass("spmenu-open") ? e.css("left", t - a) : e.css("left", t + a), i.hasClass("spmenu-open") ? i.css("left", parseInt(i.css("left")) - a) : i.css("left", parseInt(i.css("left")) + a)), i.hasClass("spmenu-right") && (t = parseInt(e.css("left")), t = t ? t : 0, i.hasClass("spmenu-open") ? e.css("left", t + a) : e.css("left", t - a), i.hasClass("spmenu-open") ? i.css("right", parseInt(i.css("right")) - a) : i.css("right", parseInt(i.css("right")) + a)), i.hasClass("spmenu-top") && (l = parseInt(e.css("top")), l = l ? l : 0, i.hasClass("spmenu-open") ? e.css("top", "auto") : e.css("top", l + o), i.hasClass("spmenu-open") ? i.css("top", parseInt(i.css("top")) - o) : i.css("top", parseInt(i.css("top")) + o)), i.hasClass("spmenu-bottom") && (l = parseInt(e.css("top")), l = l ? l : 0, i.hasClass("spmenu-open") ? e.css("top", "auto") : e.css("top", l - o), i.hasClass("spmenu-open") ? i.css("bottom", parseInt(i.css("bottom")) - o) : i.css("bottom", parseInt(i.css("bottom")) + o)), i.toggleClass("spmenu-open")
            },
            pushForceClose: function(i, n) {
                var e, t;
                return i.hasClass("spmenu-open") ? (n.removeClass("active"), e = angular.element("body"), i.hasClass("spmenu-left") && (t = parseInt(e.css("left")), t = t ? t : 0, e.css("left", t - a), i.css("left", parseInt(i.css("left")) - a)), i.hasClass("spmenu-right") && (t = parseInt(e.css("left")), t = t ? t : 0, e.css("left", t + a)), i.hasClass("spmenu-top") && (e.css("top", "auto"), i.css("top", parseInt(i.css("top")) - o)), i.hasClass("spmenu-bottom") && (e.css("top", "auto"), i.css("bottom", parseInt(i.css("bottom")) - o)), i.removeClass("spmenu-open")) : void 0
            }
        }
    }).directive("ngSlideMenu", ["slidePush", function(o) {
        return {
            restrict: "A",
            link: function(a, i, n) {
                return i.click(function() {
                    var a;
                    return a = angular.element("#" + n.ngSlideMenu), o.slide(a, i)
                })
            }
        }
    }]).directive("ngPushMenu", ["slidePush", function(o) {
        return {
            restrict: "A",
            link: function(a, i, n) {
                var e, t;
                return t = angular.element("#" + n.ngPushMenu), e = angular.element("body"), e.addClass("spmenu-push"), i.click(function() {
                    return o.push(t, i)
                })
            }
        }
    }]).directive("ngSlidePushMenu", ["$document", "slidePush", function(o, a) {
        var i, n;
        return i = function(o, a, i) {
            return n.transclude = i, n
        }, n = function(i, e, t) {
            return n.transclude(i, function(i) {
                var n, l, s, r, p, u;
                return p = t.spmClass ? t.spmClass : "", p += " spmenu spmenu-" + ("right" === t.position || "left" === t.position ? "vertical" : "horizontal") + " spmenu-" + t.position, e.addClass(p), n = angular.element("body"), t.button && (l = e.find(".spmenu-button").addClass("show"), r = t.buttonText ? t.buttonText : "", s = t.buttonClass ? t.buttonClass : "", l.addClass(s), l.append('<span class="' + s + '">' + r + "</span>"), u = t.fixTop ? "top: " + (parseInt(t.fixTop) + e.position().top) + "px; " : "", u += t.fixLeft ? "left: " + (parseInt(t.fixLeft) + e.position().left) + "px; " : "", l.attr("style", u), "slide" === t.button && (o.mouseup(function(o) {
                    return e.is(o.target) || 0 !== e.has(o.target).length || n.hasClass("modal-open") ? void 0 : a.slideForceClose(e, l)
                }), l.click(function() {
                    return a.slide(e, l)
                })), "push" === t.button && (angular.element("body").addClass("spmenu-push"), o.mouseup(function(o) {
                    return e.is(o.target) || 0 !== e.has(o.target).length || n.hasClass("modal-open") ? void 0 : a.pushForceClose(e, l)
                }), l.click(function() {
                    return a.push(e, l)
                }))), e.append(i), t.open ? l.click() : void 0
            })
        }, {
            compile: i,
            restrict: "E",
            replace: !0,
            template: '<nav><a class="spmenu-button"><i class="caret"></i></a></nav>',
            transclude: "element"
        }
    }]),
    function(o) {
        try {
            o = angular.module("momotrip")
        } catch (a) {
            o = angular.module("momotrip", [])
        }
        o.run(["$templateCache", function(o) {
            o.put("partials/dashboard.html")
        }])
    }(),
    function(o) {
        try {
            o = angular.module("momotrip")
        } catch (a) {
            o = angular.module("momotrip", [])
        }
        o.run(["$templateCache", function(o) {
            o.put("partials/deals.html", '<div class="container"><div id="deals"><div class="row"><div class="col-md-12"><div id="deals-primary-photo"><img src="http://s3.postimg.org/y5bgj2bz7/header.jpg"><div id="deal-search" class="row"><div class="col-sm-6"><form class="form-inline">Kota Asal<select class="form-control"><option>Jakarta</option><option>Bali</option><option>Yogyakarta</option><option>Raja Ampat</option><option>Singapore</option></select></form></div><div class="col-sm-6 text-right"><a href="#" class="btn btn-primary">Subscribe</a></div></div></div></div></div><div class="row"><div class="col-md-12"><h4>Penawaran Terbaik dari Momotrip</h4></div></div><div class="row"><div class="col-md-3 deals-item"><div class="deals-img"><img src="images/thumb-bali.jpg"><h3>Bali</h3></div><div class="deals-info"><span class="deals-from">Mon<br>08 Nov</span> <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> <span class="deals-to">Wed<br>10 Nov</span> <span class="deals-price">Roundtrip<br>750,000</span> <span class="deals-order"><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></span></div></div><div class="col-md-3 deals-item"><div class="deals-img"><img src="images/thumb-yogya.jpg"><h3>Jogjakarta</h3></div><div class="deals-info"><span class="deals-from">Mon<br>08 Nov</span> <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> <span class="deals-to">Wed<br>10 Nov</span> <span class="deals-price">Roundtrip<br>750,000</span> <span class="deals-order"><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></span></div></div><div class="col-md-3 deals-item"><div class="deals-img"><img src="images/thumb-bandung.jpg"><h3>Bandung</h3></div><div class="deals-info"><span class="deals-from">Mon<br>08 Nov</span> <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> <span class="deals-to">Wed<br>10 Nov</span> <span class="deals-price">Roundtrip<br>750,000</span> <span class="deals-order"><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></span></div></div><div class="col-md-3 deals-item"><div class="deals-img"><img src="images/thumb-malang.jpg"><h3>Malang</h3></div><div class="deals-info"><span class="deals-from">Mon<br>08 Nov</span> <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> <span class="deals-to">Wed<br>10 Nov</span> <span class="deals-price">Roundtrip<br>750,000</span> <span class="deals-order"><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></span></div></div><div class="col-md-3 deals-item"><div class="deals-img"><img src="images/thumb-kualalumpur.jpg"><h3>Kuala Lumpur</h3></div><div class="deals-info"><span class="deals-from">Mon<br>08 Nov</span> <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> <span class="deals-to">Wed<br>10 Nov</span> <span class="deals-price">Roundtrip<br>750,000</span> <span class="deals-order"><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></span></div></div><div class="col-md-3 deals-item"><div class="deals-img"><img src="images/thumb-makasar.jpg"><h3>Makasar</h3></div><div class="deals-info"><span class="deals-from">Mon<br>08 Nov</span> <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> <span class="deals-to">Wed<br>10 Nov</span> <span class="deals-price">Roundtrip<br>750,000</span> <span class="deals-order"><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></span></div></div><div class="col-md-3 deals-item"><div class="deals-img"><img src="images/thumb-medan.jpg"><h3>Medan</h3></div><div class="deals-info"><span class="deals-from">Mon<br>08 Nov</span> <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> <span class="deals-to">Wed<br>10 Nov</span> <span class="deals-price">Roundtrip<br>750,000</span> <span class="deals-order"><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></span></div></div><div class="col-md-3 deals-item"><div class="deals-img"><img src="images/thumb-surabaya.jpg"><h3>Surabaya</h3></div><div class="deals-info"><span class="deals-from">Mon<br>08 Nov</span> <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> <span class="deals-to">Wed<br>10 Nov</span> <span class="deals-price">Roundtrip<br>750,000</span> <span class="deals-order"><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></span></div></div></div></div></div>')
        }])
    }(),
    function(o) {
        try {
            o = angular.module("momotrip")
        } catch (a) {
            o = angular.module("momotrip", [])
        }
        o.run(["$templateCache", function(o) {
            o.put("partials/flight.html", '<div class="search-flight-container"><div id="filter" class="row" ng-show="flightresultdep"><div id="filter-flight" class="filter-item col-sm-4"><ul><li ng-click="filterMaskapai = !filterMaskapai" style="text-align: center;padding-left: 150px;"><img src="images/maskapai.png" class="icon-filter"> Maskapai <span class="icon-filter-show" ng-class="{\'show\':filterMaskapai}"></span></li></ul><div ng-show="filterMaskapai" ng-class="{\'show\':filterMaskapai}" class="filter-content maskapai-filter"><ul><li ng-repeat="airline in filterAirlines"><div class="checkbox"><label><input type="checkbox" ng-checked="selection.indexOf(airline) > -1" ng-click="toggleAirlines(airline)">{{airline}}</label></div></li></ul></div></div><div id="filter-time" class="filter-item col-sm-2"><ul><li ng-click="filterWaktu = !filterWaktu" style="text-align:center"><img src="images/jam.png" class="icon-filter"> Waktu <span class="icon-filter-show" ng-class="{\'show\':filterWaktu}"></span></li></ul><div ng-show="filterWaktu" ng-class="{\'show\':filterWaktu}" class="filter-content waktu-filter"><ul><li>Penerbangan Pergi <span ng-model="filterValueTimeRange" slider="" value="[1,12]" min="1" max="12" range="true" slider-id="rangeSlider2"></span><div class="slider-info"><div class="slider-info-pagi">00:00</div><div class="slider-info-siang"></div><div class="slider-info-malam">24:00</div></div></li><li ng-show="flightresultret">Penerbangan Pulang <span ng-model="filterValueTimeRangeRet" slider="" value="[1,12]" min="1" max="12" range="true" slider-id="rangeSlider2"></span><div class="slider-info"><div class="slider-info-pagi">00:00</div><div class="slider-info-siang"></div><div class="slider-info-malam">24:00</div></div></li></ul></div></div><div id="filter-stops" class="filter-item col-sm-2"><ul><li ng-click="filterPerhentian = !filterPerhentian" style="text-align:center"><img src="images/pemberhentian.png" class="icon-filter"> Perhentian <span class="icon-filter-show" ng-class="{\'show\':filterPerhentian}"></span></li></ul><div ng-show="filterPerhentian" ng-class="{\'show\':filterPerhentian}" class="filter-content stop-filter"><ul><li ng-repeat="stop in filterStops"><div class="checkbox"><label><input type="checkbox" ng-checked="selection.indexOf(stop) > -1" ng-click="toggleStops(stop)">{{stop}}</label></div></li></ul></div></div><div id="filter-price" class="filter-item col-sm-4"><ul><li ng-click="selectFlight(\'bestdeals\')" style="text-align: center;padding-right: 180px">BEST DEALS</li></ul></div></div><div class="container"><div id="search-result" class="row"><div class="col-md-12"><div class="row"><div class="col-md-12" ng-show="loading"><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Loading data. Mohon Tunggu.</div></div></div></div><div class="row"><div class="col-md-12" ng-show="noresult"><div class="alert alert-info" role="alert">Maaf penerbangan yang anda cari tidak ditemukan <a href="#" class="btn btn-primary btn-sm">Cari Baru</a></div></div></div><div id="newsearch" class="row" ng-show="flightresultdep"><div class="col-md-12"><form class="form-inline" role="form"><div class="form-group"><input type="text" name="dep" ng-model="flight.dep" placeholder="{{searchParams.dep}}" typeahead="(airport.location_name + \' | \' + airport.airport_code) as (airport.location_name + \' - \' + airport.airport_code) for airport in airports | filter:$viewValue" typeahead-loading="loadingLocations" class="form-control input-sm" ng-required="true"></div><img src="../images/icon-bolakbalik.png" ng-show="flightresultret"> <img src="../images/icon-bolak.png" ng-show="flightresultdep" ng-class="{\'ng-hide\' : flightresultret}"><div class="form-group"><input type="text" name="arr" ng-model="flight.arr" placeholder="{{searchParams.arr}}" typeahead="(airport.location_name + \' | \' + airport.airport_code) as (airport.location_name + \' - \' + airport.airport_code) for airport in airports | filter:$viewValue" typeahead-loading="loadingLocations" class="form-control input-sm" ng-required="true"></div><div class="input-group"><input type="text" class="form-control input-sm" placeholder="{{searchParams.date|date:\'d/M/y\'}}" name="date" datepicker-popup="d/M/y" ng-model="flight.date" min-date="minStartDate" is-open="openedddate" datepicker-options="dateOptions" show-button-bar="false" ng-required="true" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default btn-blue input-sm" ng-click="openStart()"><img src="images/calendar.png" class="btn-calendar"></i></button></span></div><div class="input-group"><input type="text" class="form-control input-sm" placeholder="{{searchParams.ret_date|date:\'d/M/y\'}}" name="ret_date" datepicker-popup="d/M/y" ng-model="flight.ret_date" min-date="minEndDate" is-open="openedrdate" datepicker-options="dateOptions" init-date="minEndDate" show-button-bar="false" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default btn-blue input-sm" ng-click="openEnd()"><img src="images/calendar.png" class="btn-calendar"></i></button></span></div><div class="input-group icon-dewasa"><select class="form-control input-sm input-person" name="adult" ng-model="flight.adult" ng-init="flight.adult = parseFloat(searchParams.adult)" required=""><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div><div class="input-group icon-anak"><select class="form-control input-sm input-person" name="child" ng-model="flight.child" ng-init="flight.child = parseFloat(searchParams.child)" required=""><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div><div class="input-group icon-bayi"><select class="form-control input-sm input-person" name="infant" ng-model="flight.infant" ng-init="flight.infant = parseFloat(searchParams.infant)" required=""><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div><div class="form-group"><button type="submit" class="btn btn-search btn-sm" ng-click="searchFlight()" ng-disabled="flightform.$invalid">Cari Lagi</button></div></form></div></div><div id="chart" class="row" ng-show="graphDepartures"><div ng-class="graphReturns ?  \'col-md-6\' : \'col-md-12\'"><h3><img src="images/plane.png" /> Penerbangan Pergi</h3><div class="chart"><ul class="chart-vert"><li></li><li></li><li></li></ul><ul class="chart-bars"><li ng-repeat="graphDep in graphDepartures"><div data-percentage="{{graphDep.procentage}}" style="height: {{graphDep.procentage}}%;" class="bar" ng-class="{{searchParams.date}} == {{graphDep.date}} ? \'selected-date\' : \'other-date\'" ng-click="changeDate(\'dep\',graphDep.date)"><div class="graph-price" ng-bind-html="graphDep.price | customCurrency"></div></div><span>{{graphDep.date | date:\'d MMM\'}}</span></li></ul></div></div><div class="col-md-6" ng-show="graphReturns"><h3><img src="images/plane.png" /> Penerbangan Pulang</h3><div class="chart"><ul class="chart-vert"><li></li><li></li><li></li></ul><ul class="chart-bars"><li ng-repeat="graphRet in graphReturns"><div data-percentage="{{graphRet.procentage}}" style="height: {{graphRet.procentage}}%;" class="bar" ng-class="{{searchParams.ret_date}} == {{graphRet.date}} ? \'selected-date\' : \'other-date\'" ng-click="changeDate(\'ret\',graphDep.date)"><div class="graph-price" ng-bind-html="graphRet.price | customCurrency"></div></div><span>{{graphRet.date | date:\'d MMM\'}}</span></li></ul></div></div></div><div class="row"></div><div class="row"><div ng-show="flightresultdep" ng-class="flightresultret ?  \'col-md-6\' : \'col-md-12\'"><div class="table-responsive"><a id="searchresult"></a><h3 class="search-title">Penerbangan Pergi</h3><table class="table"><thead><tr><th></th><th><a ng-click="sortdep = \'airlines_name\'; reverse=!reverse; sortLinkDep1=!sortLinkDep1" class="icon-sort" ng-class="{\'asc\':!sortLinkDep1, \'des\':sortLinkDep1}">Maskapai</a></th><th><a ng-click="sortdep = \'simple_departure_time\'; reverse=!reverse; sortLinkDep2=!sortLinkDep2" class="icon-sort" ng-class="{\'asc\':!sortLinkDep2, \'des\':sortLinkDep2}">Pergi</a></th><th><a ng-click="sortdep = \'simple_arrival_time\'; reverse=!reverse; sortLinkDep3=!sortLinkDep3" class="icon-sort" ng-class="{\'asc\':!sortLinkDep3, \'des\':sortLinkDep3}">Tiba</a></th><th><a ng-click="sortdep = \'price_adult\'; reverse=!reverse; sortLinkDep5=!sortLinkDep5" class="icon-sort" ng-class="{\'asc\':!sortLinkDep5, \'des\':sortLinkDep5}">Harga</a></th><th></th></tr></thead><tbody><tr ng-repeat="dep in flightresultdep | flightResultAirlinesFilter:filterValueAirlines | \n							flightResultStopsFilter:filterValueStops | \n							flightResultTimeRangeFilter:filterValueTimeRange | \n							orderBy:sortdep:reverse"><td class="flight-logo"><img ng-src="{{dep.image}}"></td><td>{{dep.airlines_name}}</td><td>{{dep.simple_departure_time}}</td><td>{{dep.simple_arrival_time}}</td><td><div class="flight-price" ng-bind-html="parseFloat(dep.price_adult) | customCurrency"></div></td><td><input type="radio" name="depRadio" id="{{dep.flight_id}}" ng-click="selectFlight(\'dep\',dep)"></td></tr></tbody></table></div></div><div class="col-md-6" ng-show="flightresultret"><div class="table-responsive"><h3 class="search-title">Penerbangan Pulang</h3><table class="table"><thead><tr><th></th><th><a ng-click="sortret = \'airlines_name\'; reverse=!reverse; sortLinkRep1=!sortLinkRep1" class="icon-sort" ng-class="{\'asc\':!sortLinkRep1, \'des\':sortLinkRep1}">Maskapai</a></th><th><a ng-click="sortret = \'simple_departure_time\'; reverse=!reverse; sortLinkRep2=!sortLinkRep2" class="icon-sort" ng-class="{\'asc\':!sortLinkRep2, \'des\':sortLinkRep2}">Pergi</a></th><th><a ng-click="sortret = \'simple_arrival_time\'; reverse=!reverse; sortLinkRep3=!sortLinkRep3" class="icon-sort" ng-class="{\'asc\':!sortLinkRep3, \'des\':sortLinkRep3}">Tiba</a></th><th><a ng-click="sortret = \'price_adult\'; reverse=!reverse; sortLinkRep5=!sortLinkRep5" class="icon-sort" ng-class="{\'asc\':!sortLinkRep5, \'des\':sortLinkRep5}">Harga</a></th><th></th></tr></thead><tbody><tr ng-repeat="ret in flightresultret | flightResultAirlinesFilter:filterValueAirlines | \n								flightResultStopsFilter:filterValueStops | \n								flightResultTimeRangeFilterRet:filterValueTimeRangeRet | \n								orderBy:sortret:reverse"><td class="flight-logo"><img ng-src="{{ret.image}}"></td><td>{{ret.airlines_name}}</td><td>{{ret.simple_departure_time}}</td><td>{{ret.simple_arrival_time}}</td><td><div class="flight-price" ng-bind-html="parseFloat(ret.price_adult) | customCurrency"></div></td><td><input type="radio" name="retRadio" id="{{ret.flight_id}}" ng-click="selectFlight(\'ret\',ret)"></td></tr></tbody></table></div></div></div></div></div></div><!--container--></div><!--searchcontainer--><div class="container"><div ng-show="order"><div class="row" id="steps"><div class="col-md-12"><h3>Penerbangan Pergi</h3><ul><li ng-class="{active: stepFillData}">Isi Data</li><li ng-class="{active: stepConfirm}">Konfirmasi</li><li ng-class="{active: stepPayment}">Pembayaran</li><li ng-class="{active: stepFinish}">Keluar</li></ul></div></div></div><div id="sum" class="row" ng-show="summary"><div class="col-md-12"><div id="sum-dep" class="sum-item" ng-show="departure"><div class="sum-title"><h3 class="sub-head">Penerbangan Pergi</h3><ul><li><img ng-src="{{departure.image}}"></li><li>{{departure.flight_number}}</li><li>{{departure.departure_city_name}} ({{departure.departure_city}}) - {{departure.arrival_city_name}} ({{departure.arrival_city}})</li><li>{{searchParams.date | date: \'EEEE d MMM yyyy\'}}</li> <li>{{departure.simple_departure_time}} - {{departure.simple_arrival_time}}</li></ul></div><div class="sum-person"><ul><li><span ng-class="{ \'ng-hide\': searchParams.adult == 0 }">{{searchParams.adult}}</span> <span class="icon-dewasa" ng-class="{ grey: searchParams.adult == 0 }"></span></li><li><span ng-class="{ \'ng-hide\': searchParams.child == 0 }">{{searchParams.child}}</span> <span class="icon-anak" ng-class="{ grey: searchParams.child == 0 }"></span></li><li><span ng-class="{ \'ng-hide\': searchParams.infant == 0 }">{{searchParams.infant}}</span> <span class="icon-bayi" ng-class="{ grey: searchParams.infant == 0 }"></span></li><li><div class="flight-price kanan" ng-bind-html="( ( (parseFloat(departure.price_adult) * searchParams.adult) + (parseFloat(departure.price_child) * searchParams.child) + (parseFloat(departure.price_infant) * searchParams.infant) ) | customCurrency )"></div></li></ul></div></div><div id="sum-ret" class="sum-item" ng-show="returnflight"><div class="sum-title"><h3 class="sub-head">Penerbangan Pulang</h3><ul><li><img src="{{returnflight.image}}"></li><li>{{returnflight.flight_number}}</li><li>{{returnflight.departure_city_name}} ({{returnflight.departure_city}}) - {{returnflight.arrival_city_name}} ({{returnflight.arrival_city}})</li><li>{{searchParams.ret_date | date: \'EEEE d MMM yyyy\'}}<li>{{returnflight.simple_departure_time}} - {{returnflight.simple_arrival_time}}</li></ul></div><div class="sum-detail"></div><div class="sum-person"><ul><li><span ng-class="{ \'ng-hide\': searchParams.adult == 0 }">{{searchParams.adult}}</span> <span class="icon-dewasa" ng-class="{ grey: searchParams.adult == 0 }"></span></li><li><span ng-class="{ \'ng-hide\': searchParams.child == 0 }">{{searchParams.child}}</span> <span class="icon-anak" ng-class="{ grey: searchParams.child == 0 }"></span></li><li><span ng-class="{ \'ng-hide\': searchParams.infant == 0 }">{{searchParams.infant}}</span> <span class="icon-bayi" ng-class="{ grey: searchParams.infant == 0 }"></span></li><li><div class="flight-price" ng-bind-html="( ( (parseFloat(returnflight.price_adult) * searchParams.adult) + (parseFloat(returnflight.price_child) * searchParams.child) + (parseFloat(returnflight.price_infant) * searchParams.infant) ) | customCurrency )"></div></li></ul></div></div><div id="sum-tot" class="sum-item" ng-show="departure && !returnflight"><div class="sum-totdesc">Total<br><small>*) sebelum pajak dan biaya service</small></div><div class="sum-totnumb"><div class="flight-price" ng-bind-html="( ( (parseFloat(departure.price_adult) * searchParams.adult) + (parseFloat(departure.price_child) * searchParams.child) + (parseFloat(departure.price_infant) * searchParams.infant) ) | customCurrency )"></div></div></div><div id="sum-tot" class="sum-item" ng-show="returnflight"><div class="sum-totdesc">Total<br><small>*) sebelum pajak dan biaya service</small></div><div class="sum-totnumb"><div class="flight-price" ng-bind-html="( ( (parseFloat(departure.price_adult) * searchParams.adult) + (parseFloat(departure.price_child) * searchParams.child) + (parseFloat(departure.price_infant) * searchParams.infant) + (parseFloat(returnflight.price_adult) * searchParams.adult) + (parseFloat(returnflight.price_child) * searchParams.child) + (parseFloat(returnflight.price_infant) * searchParams.infant) ) | customCurrency )"></div></div></div></div><div class="col-md-12" ng-show="departure; !order"><p class="text-right"><button type="submit" class="btn btn-primary" ng-click="confirmFlight()">Lanjut</button></p></div></div><div ng-show="order"><div class="row" ng-show="!logged && stepFillData"><div class="col-sm-12"><div class="panel panel-info"><div class="panel-body">Mohon memberikan informasi sesuai dengan identitas anda. Login dengan akun anda untuk mempercepat proses isi data <button type="button" ng-click="clickLogin()" class="btn btn-primary btn-sm" ng-show="!logged">Login</button></div></div></div></div><div class="row" ng-show="stepFillData"><div id="order-u" class="col-md-12"><form role="orderform" name="orderform" class="row"><div class="col-sm-6"><div id="contact-person" class="panel panel-info"><div class="panel-heading"><h3 class="panel-title">Informasi Kontak yang Dapat Dihubungi</h3></div><div class="panel-body"><div class="row"><div class="col-sm-2"><div class="form-group"><label for="salutation">Titel</label><select class="form-control" name="salutation" ng-model="order.conSalutation"><option>Mr</option><option>Mrs</option><option>Miss</option></select></div></div><div class="col-sm-5"><div class="form-group"><label for="firstname">Nama Depan</label> <input type="text" class="form-control" name="firstname" ng-model="order.conFirstName" placeholder="First Name" ng-required="true"></div></div><div class="col-sm-5"><div class="form-group"><label for="lastname">Nama Belakang</label> <input type="text" class="form-control" name="lastname" ng-model="order.conLastName" placeholder="Last Name" ng-required="true"></div></div></div><div class="form-group"><label for="phone">Nomor Telepon</label> <input type="text" class="form-control" name="phone" ng-model="order.conPhone" placeholder="Phone Number" ng-required="true"></div><div class="form-group"><label for="email">Alamat Email</label> <input type="email" class="form-control" name="email" ng-model="order.conEmailAddress" placeholder="Email Address" ng-required="true"></div></div></div></div><div id="detail-penumpang" class="col-sm-6"><div class="panel panel-info"><div class="panel-heading"><h3 class="panel-title">Detil Penumpang</h3></div><div class="panel-body"><tabset justified="true"><tab ng-repeat="a in adults" heading="Dewasa {{a+1}}"><div ng-if="$first" class="form-group"><div class="checkbox"><label><input type="checkbox" ng-click="iAm()"> Sayalah penumpang itu</label></div></div><div class="form-group"><label for="firstnamea">No. Identitas / Paspor</label> <input type="text" class="form-control" name="ida" ng-model="order.ida[a+1]" placeholder="No. Identitas / Paspor" ng-required="adults"></div><div class="row"><div class="col-sm-2"><div class="form-group"><label for="salutationa">Titel</label><select class="form-control" name="salutationa" ng-model="order.titlea[a+1]"><option>Mr</option><option>Mrs</option><option>Miss</option></select></div></div><div class="col-sm-5"><div class="form-group"><label for="firstnamea">Nama Depan</label> <input type="text" class="form-control" name="firstnamea" ng-model="order.firstnamea[a+1]" placeholder="Nama Depan" ng-required="adults"></div></div><div class="col-sm-5"><div class="form-group"><label for="lastnamea">Nama Belakang</label> <input type="text" class="form-control" name="lastnamea" ng-model="order.lastnamea[a+1]" placeholder="Nama Belakang" ng-required="adults"></div></div></div><div class="form-group"><label class="control-label">Kewarnanegaraan</label><select class="form-control"><option value="">-- Pilih --</option><option value="afghan">Afghan</option><option value="albanian">Albanian</option><option value="algerian">Algerian</option><option value="american">American</option><option value="andorran">Andorran</option><option value="angolan">Angolan</option><option value="antiguans">Antiguans</option><option value="argentinean">Argentinean</option><option value="armenian">Armenian</option><option value="australian">Australian</option><option value="austrian">Austrian</option><option value="azerbaijani">Azerbaijani</option><option value="bahamian">Bahamian</option><option value="bahraini">Bahraini</option><option value="bangladeshi">Bangladeshi</option><option value="barbadian">Barbadian</option><option value="barbudans">Barbudans</option><option value="batswana">Batswana</option><option value="belarusian">Belarusian</option><option value="belgian">Belgian</option><option value="belizean">Belizean</option><option value="beninese">Beninese</option><option value="bhutanese">Bhutanese</option><option value="bolivian">Bolivian</option><option value="bosnian">Bosnian</option><option value="brazilian">Brazilian</option><option value="british">British</option><option value="bruneian">Bruneian</option><option value="bulgarian">Bulgarian</option><option value="burkinabe">Burkinabe</option><option value="burmese">Burmese</option><option value="burundian">Burundian</option><option value="cambodian">Cambodian</option><option value="cameroonian">Cameroonian</option><option value="canadian">Canadian</option><option value="cape verdean">Cape Verdean</option><option value="central african">Central African</option><option value="chadian">Chadian</option><option value="chilean">Chilean</option><option value="chinese">Chinese</option><option value="colombian">Colombian</option><option value="comoran">Comoran</option><option value="congolese">Congolese</option><option value="costa rican">Costa Rican</option><option value="croatian">Croatian</option><option value="cuban">Cuban</option><option value="cypriot">Cypriot</option><option value="czech">Czech</option><option value="danish">Danish</option><option value="djibouti">Djibouti</option><option value="dominican">Dominican</option><option value="dutch">Dutch</option><option value="east timorese">East Timorese</option><option value="ecuadorean">Ecuadorean</option><option value="egyptian">Egyptian</option><option value="emirian">Emirian</option><option value="equatorial guinean">Equatorial Guinean</option><option value="eritrean">Eritrean</option><option value="estonian">Estonian</option><option value="ethiopian">Ethiopian</option><option value="fijian">Fijian</option><option value="filipino">Filipino</option><option value="finnish">Finnish</option><option value="french">French</option><option value="gabonese">Gabonese</option><option value="gambian">Gambian</option><option value="georgian">Georgian</option><option value="german">German</option><option value="ghanaian">Ghanaian</option><option value="greek">Greek</option><option value="grenadian">Grenadian</option><option value="guatemalan">Guatemalan</option><option value="guinea-bissauan">Guinea-Bissauan</option><option value="guinean">Guinean</option><option value="guyanese">Guyanese</option><option value="haitian">Haitian</option><option value="herzegovinian">Herzegovinian</option><option value="honduran">Honduran</option><option value="hungarian">Hungarian</option><option value="icelander">Icelander</option><option value="indian">Indian</option><option value="indonesian">Indonesian</option><option value="iranian">Iranian</option><option value="iraqi">Iraqi</option><option value="irish">Irish</option><option value="israeli">Israeli</option><option value="italian">Italian</option><option value="ivorian">Ivorian</option><option value="jamaican">Jamaican</option><option value="japanese">Japanese</option><option value="jordanian">Jordanian</option><option value="kazakhstani">Kazakhstani</option><option value="kenyan">Kenyan</option><option value="kittian and nevisian">Kittian and Nevisian</option><option value="kuwaiti">Kuwaiti</option><option value="kyrgyz">Kyrgyz</option><option value="laotian">Laotian</option><option value="latvian">Latvian</option><option value="lebanese">Lebanese</option><option value="liberian">Liberian</option><option value="libyan">Libyan</option><option value="liechtensteiner">Liechtensteiner</option><option value="lithuanian">Lithuanian</option><option value="luxembourger">Luxembourger</option><option value="macedonian">Macedonian</option><option value="malagasy">Malagasy</option><option value="malawian">Malawian</option><option value="malaysian">Malaysian</option><option value="maldivan">Maldivan</option><option value="malian">Malian</option><option value="maltese">Maltese</option><option value="marshallese">Marshallese</option><option value="mauritanian">Mauritanian</option><option value="mauritian">Mauritian</option><option value="mexican">Mexican</option><option value="micronesian">Micronesian</option><option value="moldovan">Moldovan</option><option value="monacan">Monacan</option><option value="mongolian">Mongolian</option><option value="moroccan">Moroccan</option><option value="mosotho">Mosotho</option><option value="motswana">Motswana</option><option value="mozambican">Mozambican</option><option value="namibian">Namibian</option><option value="nauruan">Nauruan</option><option value="nepalese">Nepalese</option><option value="new zealander">New Zealander</option><option value="ni-vanuatu">Ni-Vanuatu</option><option value="nicaraguan">Nicaraguan</option><option value="nigerien">Nigerien</option><option value="north korean">North Korean</option><option value="northern irish">Northern Irish</option><option value="norwegian">Norwegian</option><option value="omani">Omani</option><option value="pakistani">Pakistani</option><option value="palauan">Palauan</option><option value="panamanian">Panamanian</option><option value="papua new guinean">Papua New Guinean</option><option value="paraguayan">Paraguayan</option><option value="peruvian">Peruvian</option><option value="polish">Polish</option><option value="portuguese">Portuguese</option><option value="qatari">Qatari</option><option value="romanian">Romanian</option><option value="russian">Russian</option><option value="rwandan">Rwandan</option><option value="saint lucian">Saint Lucian</option><option value="salvadoran">Salvadoran</option><option value="samoan">Samoan</option><option value="san marinese">San Marinese</option><option value="sao tomean">Sao Tomean</option><option value="saudi">Saudi</option><option value="scottish">Scottish</option><option value="senegalese">Senegalese</option><option value="serbian">Serbian</option><option value="seychellois">Seychellois</option><option value="sierra leonean">Sierra Leonean</option><option value="singaporean">Singaporean</option><option value="slovakian">Slovakian</option><option value="slovenian">Slovenian</option><option value="solomon islander">Solomon Islander</option><option value="somali">Somali</option><option value="south african">South African</option><option value="south korean">South Korean</option><option value="spanish">Spanish</option><option value="sri lankan">Sri Lankan</option><option value="sudanese">Sudanese</option><option value="surinamer">Surinamer</option><option value="swazi">Swazi</option><option value="swedish">Swedish</option><option value="swiss">Swiss</option><option value="syrian">Syrian</option><option value="taiwanese">Taiwanese</option><option value="tajik">Tajik</option><option value="tanzanian">Tanzanian</option><option value="thai">Thai</option><option value="togolese">Togolese</option><option value="tongan">Tongan</option><option value="trinidadian or tobagonian">Trinidadian or Tobagonian</option><option value="tunisian">Tunisian</option><option value="turkish">Turkish</option><option value="tuvaluan">Tuvaluan</option><option value="ugandan">Ugandan</option><option value="ukrainian">Ukrainian</option><option value="uruguayan">Uruguayan</option><option value="uzbekistani">Uzbekistani</option><option value="venezuelan">Venezuelan</option><option value="vietnamese">Vietnamese</option><option value="welsh">Welsh</option><option value="yemenite">Yemenite</option><option value="zambian">Zambian</option><option value="zimbabwean">Zimbabwean</option></select></div><div class="form-group form-inline"><label for="birtha">Tanggal Lahir</label><br><select class="form-control" name="birthad[]" ng-model="order.birthdatead[a+1]" ng-options="date for date in birthdates track by date" ng-required="adults"><option value="">Hari</option></select><select class="form-control" name="birtham[]" ng-model="order.birthdateam[a+1]" ng-options="month.key as month.name for month in birthmonths" ng-required="adults"><option value="">Bulan</option></select><select class="form-control" name="birthay[]" ng-model="order.birthdateay[a+1]" ng-options="year for year in birthyears track by year" ng-required="adults"><option value="">Tahun</option></select></div></tab><tab ng-repeat="c in childs" heading="Anak {{c+1}}"><div class="form-group"><label for="firstnamea">No. Identitas / Paspor</label> <input type="text" class="form-control" name="idc" ng-model="order.idc[c+1]" placeholder="No. Identitas / Paspor" ng-required="childs"></div><div class="row"><div class="col-sm-2"><div class="form-group"><label for="salutationc">Titel</label><select class="form-control" name="salutationc" ng-model="order.titlec[c+1]" ng-required="childs"><option>Mr</option><option>Mrs</option><option>Miss</option></select></div></div><div class="col-sm-5"><div class="form-group"><label for="firstname">Nama Depan</label> <input type="text" class="form-control" name="firstnamec" ng-model="order.firstnamec[c+1]" placeholder="Nama Depan" ng-required="childs"></div></div><div class="col-sm-5"><div class="form-group"><label for="lastnamec">Nama Belakang</label> <input type="text" class="form-control" name="lastnamec" ng-model="order.lastnamec[c+1]" placeholder="Nama Belakang" ng-required="childs"></div></div></div><div class="form-group"><label class="control-label">Kewarnanegaraan</label><select class="form-control"><option value="">-- Pilih --</option><option value="afghan">Afghan</option><option value="albanian">Albanian</option><option value="algerian">Algerian</option><option value="american">American</option><option value="andorran">Andorran</option><option value="angolan">Angolan</option><option value="antiguans">Antiguans</option><option value="argentinean">Argentinean</option><option value="armenian">Armenian</option><option value="australian">Australian</option><option value="austrian">Austrian</option><option value="azerbaijani">Azerbaijani</option><option value="bahamian">Bahamian</option><option value="bahraini">Bahraini</option><option value="bangladeshi">Bangladeshi</option><option value="barbadian">Barbadian</option><option value="barbudans">Barbudans</option><option value="batswana">Batswana</option><option value="belarusian">Belarusian</option><option value="belgian">Belgian</option><option value="belizean">Belizean</option><option value="beninese">Beninese</option><option value="bhutanese">Bhutanese</option><option value="bolivian">Bolivian</option><option value="bosnian">Bosnian</option><option value="brazilian">Brazilian</option><option value="british">British</option><option value="bruneian">Bruneian</option><option value="bulgarian">Bulgarian</option><option value="burkinabe">Burkinabe</option><option value="burmese">Burmese</option><option value="burundian">Burundian</option><option value="cambodian">Cambodian</option><option value="cameroonian">Cameroonian</option><option value="canadian">Canadian</option><option value="cape verdean">Cape Verdean</option><option value="central african">Central African</option><option value="chadian">Chadian</option><option value="chilean">Chilean</option><option value="chinese">Chinese</option><option value="colombian">Colombian</option><option value="comoran">Comoran</option><option value="congolese">Congolese</option><option value="costa rican">Costa Rican</option><option value="croatian">Croatian</option><option value="cuban">Cuban</option><option value="cypriot">Cypriot</option><option value="czech">Czech</option><option value="danish">Danish</option><option value="djibouti">Djibouti</option><option value="dominican">Dominican</option><option value="dutch">Dutch</option><option value="east timorese">East Timorese</option><option value="ecuadorean">Ecuadorean</option><option value="egyptian">Egyptian</option><option value="emirian">Emirian</option><option value="equatorial guinean">Equatorial Guinean</option><option value="eritrean">Eritrean</option><option value="estonian">Estonian</option><option value="ethiopian">Ethiopian</option><option value="fijian">Fijian</option><option value="filipino">Filipino</option><option value="finnish">Finnish</option><option value="french">French</option><option value="gabonese">Gabonese</option><option value="gambian">Gambian</option><option value="georgian">Georgian</option><option value="german">German</option><option value="ghanaian">Ghanaian</option><option value="greek">Greek</option><option value="grenadian">Grenadian</option><option value="guatemalan">Guatemalan</option><option value="guinea-bissauan">Guinea-Bissauan</option><option value="guinean">Guinean</option><option value="guyanese">Guyanese</option><option value="haitian">Haitian</option><option value="herzegovinian">Herzegovinian</option><option value="honduran">Honduran</option><option value="hungarian">Hungarian</option><option value="icelander">Icelander</option><option value="indian">Indian</option><option value="indonesian">Indonesian</option><option value="iranian">Iranian</option><option value="iraqi">Iraqi</option><option value="irish">Irish</option><option value="israeli">Israeli</option><option value="italian">Italian</option><option value="ivorian">Ivorian</option><option value="jamaican">Jamaican</option><option value="japanese">Japanese</option><option value="jordanian">Jordanian</option><option value="kazakhstani">Kazakhstani</option><option value="kenyan">Kenyan</option><option value="kittian and nevisian">Kittian and Nevisian</option><option value="kuwaiti">Kuwaiti</option><option value="kyrgyz">Kyrgyz</option><option value="laotian">Laotian</option><option value="latvian">Latvian</option><option value="lebanese">Lebanese</option><option value="liberian">Liberian</option><option value="libyan">Libyan</option><option value="liechtensteiner">Liechtensteiner</option><option value="lithuanian">Lithuanian</option><option value="luxembourger">Luxembourger</option><option value="macedonian">Macedonian</option><option value="malagasy">Malagasy</option><option value="malawian">Malawian</option><option value="malaysian">Malaysian</option><option value="maldivan">Maldivan</option><option value="malian">Malian</option><option value="maltese">Maltese</option><option value="marshallese">Marshallese</option><option value="mauritanian">Mauritanian</option><option value="mauritian">Mauritian</option><option value="mexican">Mexican</option><option value="micronesian">Micronesian</option><option value="moldovan">Moldovan</option><option value="monacan">Monacan</option><option value="mongolian">Mongolian</option><option value="moroccan">Moroccan</option><option value="mosotho">Mosotho</option><option value="motswana">Motswana</option><option value="mozambican">Mozambican</option><option value="namibian">Namibian</option><option value="nauruan">Nauruan</option><option value="nepalese">Nepalese</option><option value="new zealander">New Zealander</option><option value="ni-vanuatu">Ni-Vanuatu</option><option value="nicaraguan">Nicaraguan</option><option value="nigerien">Nigerien</option><option value="north korean">North Korean</option><option value="northern irish">Northern Irish</option><option value="norwegian">Norwegian</option><option value="omani">Omani</option><option value="pakistani">Pakistani</option><option value="palauan">Palauan</option><option value="panamanian">Panamanian</option><option value="papua new guinean">Papua New Guinean</option><option value="paraguayan">Paraguayan</option><option value="peruvian">Peruvian</option><option value="polish">Polish</option><option value="portuguese">Portuguese</option><option value="qatari">Qatari</option><option value="romanian">Romanian</option><option value="russian">Russian</option><option value="rwandan">Rwandan</option><option value="saint lucian">Saint Lucian</option><option value="salvadoran">Salvadoran</option><option value="samoan">Samoan</option><option value="san marinese">San Marinese</option><option value="sao tomean">Sao Tomean</option><option value="saudi">Saudi</option><option value="scottish">Scottish</option><option value="senegalese">Senegalese</option><option value="serbian">Serbian</option><option value="seychellois">Seychellois</option><option value="sierra leonean">Sierra Leonean</option><option value="singaporean">Singaporean</option><option value="slovakian">Slovakian</option><option value="slovenian">Slovenian</option><option value="solomon islander">Solomon Islander</option><option value="somali">Somali</option><option value="south african">South African</option><option value="south korean">South Korean</option><option value="spanish">Spanish</option><option value="sri lankan">Sri Lankan</option><option value="sudanese">Sudanese</option><option value="surinamer">Surinamer</option><option value="swazi">Swazi</option><option value="swedish">Swedish</option><option value="swiss">Swiss</option><option value="syrian">Syrian</option><option value="taiwanese">Taiwanese</option><option value="tajik">Tajik</option><option value="tanzanian">Tanzanian</option><option value="thai">Thai</option><option value="togolese">Togolese</option><option value="tongan">Tongan</option><option value="trinidadian or tobagonian">Trinidadian or Tobagonian</option><option value="tunisian">Tunisian</option><option value="turkish">Turkish</option><option value="tuvaluan">Tuvaluan</option><option value="ugandan">Ugandan</option><option value="ukrainian">Ukrainian</option><option value="uruguayan">Uruguayan</option><option value="uzbekistani">Uzbekistani</option><option value="venezuelan">Venezuelan</option><option value="vietnamese">Vietnamese</option><option value="welsh">Welsh</option><option value="yemenite">Yemenite</option><option value="zambian">Zambian</option><option value="zimbabwean">Zimbabwean</option></select></div><div class="form-group form-inline"><label for="birthc">Tanggal Lahir</label><br><select class="form-control" name="birthcd[]" ng-model="order.birthdatecd[c+1]" ng-options="date for date in birthdates track by date" ng-required="childs"><option value="">Hari</option></select><select class="form-control" name="birthcm[]" ng-model="order.birthdatecm[c+1]" ng-options="month.key as month.name for month in birthmonths" ng-required="childs"><option value="">Bulan</option></select><select class="form-control" name="birthcy[]" ng-model="order.birthdatecy[c+1]" ng-options="year for year in birthyears track by year" ng-required="childs"><option value="">Tahun</option></select></div></tab><tab ng-repeat="i in infants" heading="Bayi {{i+1}}"><div class="form-group"><label for="firstnamea">No. Identitas / Passport</label> <input type="text" class="form-control" name="idi" ng-model="order.idi[i+1]" placeholder="No. Identitas / Paspor" ng-required="infants"></div><div class="row"><div class="col-sm-2"><div class="form-group"><label for="salutationi">Title</label><select class="form-control" name="i" ng-model="order.titlei[i+1]" ng-required="infants"><option>Mr</option><option>Mrs</option><option>Miss</option></select></div></div><div class="col-sm-5"><div class="form-group"><label for="firstnamei">Nama Depan</label> <input type="text" class="form-control" name="firstnamei" ng-model="order.firstnamei[i+1]" placeholder="Nama Depan" ng-required="infants"></div></div><div class="col-sm-5"><div class="form-group"><label for="lastnamei">Nama Belakang</label> <input type="text" class="form-control" name="lastnamei" ng-model="order.lastnamei[i+1]" placeholder="Nama Belakang" ng-required="infants"></div></div></div><div class="form-group"><label class="control-label">Kewarnanegaraan</label><select class="form-control"><option value="">-- Pilih --</option><option value="afghan">Afghan</option><option value="albanian">Albanian</option><option value="algerian">Algerian</option><option value="american">American</option><option value="andorran">Andorran</option><option value="angolan">Angolan</option><option value="antiguans">Antiguans</option><option value="argentinean">Argentinean</option><option value="armenian">Armenian</option><option value="australian">Australian</option><option value="austrian">Austrian</option><option value="azerbaijani">Azerbaijani</option><option value="bahamian">Bahamian</option><option value="bahraini">Bahraini</option><option value="bangladeshi">Bangladeshi</option><option value="barbadian">Barbadian</option><option value="barbudans">Barbudans</option><option value="batswana">Batswana</option><option value="belarusian">Belarusian</option><option value="belgian">Belgian</option><option value="belizean">Belizean</option><option value="beninese">Beninese</option><option value="bhutanese">Bhutanese</option><option value="bolivian">Bolivian</option><option value="bosnian">Bosnian</option><option value="brazilian">Brazilian</option><option value="british">British</option><option value="bruneian">Bruneian</option><option value="bulgarian">Bulgarian</option><option value="burkinabe">Burkinabe</option><option value="burmese">Burmese</option><option value="burundian">Burundian</option><option value="cambodian">Cambodian</option><option value="cameroonian">Cameroonian</option><option value="canadian">Canadian</option><option value="cape verdean">Cape Verdean</option><option value="central african">Central African</option><option value="chadian">Chadian</option><option value="chilean">Chilean</option><option value="chinese">Chinese</option><option value="colombian">Colombian</option><option value="comoran">Comoran</option><option value="congolese">Congolese</option><option value="costa rican">Costa Rican</option><option value="croatian">Croatian</option><option value="cuban">Cuban</option><option value="cypriot">Cypriot</option><option value="czech">Czech</option><option value="danish">Danish</option><option value="djibouti">Djibouti</option><option value="dominican">Dominican</option><option value="dutch">Dutch</option><option value="east timorese">East Timorese</option><option value="ecuadorean">Ecuadorean</option><option value="egyptian">Egyptian</option><option value="emirian">Emirian</option><option value="equatorial guinean">Equatorial Guinean</option><option value="eritrean">Eritrean</option><option value="estonian">Estonian</option><option value="ethiopian">Ethiopian</option><option value="fijian">Fijian</option><option value="filipino">Filipino</option><option value="finnish">Finnish</option><option value="french">French</option><option value="gabonese">Gabonese</option><option value="gambian">Gambian</option><option value="georgian">Georgian</option><option value="german">German</option><option value="ghanaian">Ghanaian</option><option value="greek">Greek</option><option value="grenadian">Grenadian</option><option value="guatemalan">Guatemalan</option><option value="guinea-bissauan">Guinea-Bissauan</option><option value="guinean">Guinean</option><option value="guyanese">Guyanese</option><option value="haitian">Haitian</option><option value="herzegovinian">Herzegovinian</option><option value="honduran">Honduran</option><option value="hungarian">Hungarian</option><option value="icelander">Icelander</option><option value="indian">Indian</option><option value="indonesian">Indonesian</option><option value="iranian">Iranian</option><option value="iraqi">Iraqi</option><option value="irish">Irish</option><option value="israeli">Israeli</option><option value="italian">Italian</option><option value="ivorian">Ivorian</option><option value="jamaican">Jamaican</option><option value="japanese">Japanese</option><option value="jordanian">Jordanian</option><option value="kazakhstani">Kazakhstani</option><option value="kenyan">Kenyan</option><option value="kittian and nevisian">Kittian and Nevisian</option><option value="kuwaiti">Kuwaiti</option><option value="kyrgyz">Kyrgyz</option><option value="laotian">Laotian</option><option value="latvian">Latvian</option><option value="lebanese">Lebanese</option><option value="liberian">Liberian</option><option value="libyan">Libyan</option><option value="liechtensteiner">Liechtensteiner</option><option value="lithuanian">Lithuanian</option><option value="luxembourger">Luxembourger</option><option value="macedonian">Macedonian</option><option value="malagasy">Malagasy</option><option value="malawian">Malawian</option><option value="malaysian">Malaysian</option><option value="maldivan">Maldivan</option><option value="malian">Malian</option><option value="maltese">Maltese</option><option value="marshallese">Marshallese</option><option value="mauritanian">Mauritanian</option><option value="mauritian">Mauritian</option><option value="mexican">Mexican</option><option value="micronesian">Micronesian</option><option value="moldovan">Moldovan</option><option value="monacan">Monacan</option><option value="mongolian">Mongolian</option><option value="moroccan">Moroccan</option><option value="mosotho">Mosotho</option><option value="motswana">Motswana</option><option value="mozambican">Mozambican</option><option value="namibian">Namibian</option><option value="nauruan">Nauruan</option><option value="nepalese">Nepalese</option><option value="new zealander">New Zealander</option><option value="ni-vanuatu">Ni-Vanuatu</option><option value="nicaraguan">Nicaraguan</option><option value="nigerien">Nigerien</option><option value="north korean">North Korean</option><option value="northern irish">Northern Irish</option><option value="norwegian">Norwegian</option><option value="omani">Omani</option><option value="pakistani">Pakistani</option><option value="palauan">Palauan</option><option value="panamanian">Panamanian</option><option value="papua new guinean">Papua New Guinean</option><option value="paraguayan">Paraguayan</option><option value="peruvian">Peruvian</option><option value="polish">Polish</option><option value="portuguese">Portuguese</option><option value="qatari">Qatari</option><option value="romanian">Romanian</option><option value="russian">Russian</option><option value="rwandan">Rwandan</option><option value="saint lucian">Saint Lucian</option><option value="salvadoran">Salvadoran</option><option value="samoan">Samoan</option><option value="san marinese">San Marinese</option><option value="sao tomean">Sao Tomean</option><option value="saudi">Saudi</option><option value="scottish">Scottish</option><option value="senegalese">Senegalese</option><option value="serbian">Serbian</option><option value="seychellois">Seychellois</option><option value="sierra leonean">Sierra Leonean</option><option value="singaporean">Singaporean</option><option value="slovakian">Slovakian</option><option value="slovenian">Slovenian</option><option value="solomon islander">Solomon Islander</option><option value="somali">Somali</option><option value="south african">South African</option><option value="south korean">South Korean</option><option value="spanish">Spanish</option><option value="sri lankan">Sri Lankan</option><option value="sudanese">Sudanese</option><option value="surinamer">Surinamer</option><option value="swazi">Swazi</option><option value="swedish">Swedish</option><option value="swiss">Swiss</option><option value="syrian">Syrian</option><option value="taiwanese">Taiwanese</option><option value="tajik">Tajik</option><option value="tanzanian">Tanzanian</option><option value="thai">Thai</option><option value="togolese">Togolese</option><option value="tongan">Tongan</option><option value="trinidadian or tobagonian">Trinidadian or Tobagonian</option><option value="tunisian">Tunisian</option><option value="turkish">Turkish</option><option value="tuvaluan">Tuvaluan</option><option value="ugandan">Ugandan</option><option value="ukrainian">Ukrainian</option><option value="uruguayan">Uruguayan</option><option value="uzbekistani">Uzbekistani</option><option value="venezuelan">Venezuelan</option><option value="vietnamese">Vietnamese</option><option value="welsh">Welsh</option><option value="yemenite">Yemenite</option><option value="zambian">Zambian</option><option value="zimbabwean">Zimbabwean</option></select></div><div class="form-group form-inline"><label for="birthai">Tanggal Lahir</label><br><select class="form-control" name="birthid[]" ng-model="order.birthdateid[i+1]" ng-options="date for date in birthdates track by date" ng-required="infants"><option value="">Hari</option></select><select class="form-control" name="birthim[]" ng-model="order.birthdateim[i+1]" ng-options="month.key as month.name for month in birthmonths" ng-required="infants"><option value="">Bulan</option></select><select class="form-control" name="birthiy[]" ng-model="order.birthdateiy[i+1]" ng-options="year for year in birthyears track by year" ng-required="infants"><option value="">Tahun</option></select></div><div class="form-group"><label for="parenti">Orang Tua</label> <input type="text" class="form-control" name="parenti" ng-model="order.parenti[i+1]" placeholder="Infant Parent" ng-required="infants"></div></tab></tabset></div></div><p class="text-right"><button type="submit" class="btn btn-primary" ng-click="addOrder()" ng-disabled="orderform.$invalid">Lanjut</button></p></div></form></div></div><div class="row" ng-show="stepConfirm"><div class="col-md-12" ng-show="ordererror"><div class="alert alert-danger" role="alert"><p>Maaf, terjadi kesalahan teknis saat memproses order anda, silahkan coba beberapa saat lagi</p></div></div><div id="conf-bio" class="col-sm-12"><div class="panel panel-info"><div class="panel-heading"><h3 class="panel-title">Detil Penumpang</h3></div><div class="panel-body"><tabset justified="true"><tab heading="Dewasa 1"><h2>Mr. Den Widhana</h2><ul class="conf-list"><li><span>No. Identitas:</span> 123456789</li><li><span>Kewarganegaraan:</span> Indonesia</li><li><span>No. Telpon:</span> 1234556</li><li><span>Email:</span> 15june@gmail.com</li></ul></tab><tab heading="Dewasa 2"><h2>Mr. Johnny Depp</h2><ul class="conf-list"><li><span>No. Identitas:</span> 123456789</li><li><span>Kewarganegaraan:</span> Indonesia</li><li><span>No. Telpon:</span> 1234556</li><li><span>Email:</span> 15june@gmail.com</li></ul></tab><tab heading="Dewasa 3"><h2>Mr. David Fincher</h2><ul class="conf-list"><li><span>No. Identitas:</span> 123456789</li><li><span>Kewarganegaraan:</span> Indonesia</li><li><span>No. Telpon:</span> 1234556</li><li><span>Email:</span> 15june@gmail.com</li></ul></tab><tab heading="Dewasa 4"><h2>Mr. Chris Nolan</h2><ul class="conf-list"><li><span>No. Identitas:</span> 123456789</li><li><span>Kewarganegaraan:</span> Indonesia</li><li><span>No. Telpon:</span> 1234556</li><li><span>Email:</span> 15june@gmail.com</li></ul></tab><tab heading="Dewasa 5"><h2>Mr. Bruce Wayne</h2><ul class="conf-list"><li><span>No. Identitas:</span> 123456789</li><li><span>Kewarganegaraan:</span> Indonesia</li><li><span>No. Telpon:</span> 1234556</li><li><span>Email:</span> 15june@gmail.com</li></ul></tab></tabset></div></div></div><div class="col-md-12" ng-show="orderresponse"><h3>Detail order</h3>Order ID: {{orderresponse.order.order_id}}<br>Total: IDR {{orderresponse.order.total}}<br><h4>Order List</h4><div class="sum-item" ng-repeat="orderdetail in orderresponse.order.data"><div class="sum-title"><ul><li><img ng-src="{{orderdetail.order_photo}}"></li><li><strong>{{orderdetail.order_name_detail}}</strong></li><li>{{orderdetail.detail.flight_date | date: \'EEEE d MMM yyyy\'}}<br><strong>{{orderdetail.detail.departure_time}} - {{orderdetail.detail.arrival_time}}</strong></li></ul></div><div class="sum-detail"><ul><li>{{orderdetail.order_name}}</li><li><div class="flight-price">{{orderdetail.subtotal_and_charge}}</div></li></ul></div><div class="sum-person"></div></div><div class="sum-item"><div class="sum-totdesc">Total<br><small>*) setelah pajak dan biaya service</small></div><div class="sum-totnumb"><div class="flight-price">{{orderresponse.order.total}}</div></div></div><form role="paymentform" name="paymentform"><p><button type="submit" class="btn btn-primary" ng-click="checkout()" ng-disabled="paymentform.$invalid">Lanjutkan Pembayaran</button></p></form></div></div></div></div>')
        }])
    }(),
    function(o) {
        try {
            o = angular.module("momotrip")
        } catch (a) {
            o = angular.module("momotrip", [])
        }
        o.run(["$templateCache", function(o) {
            o.put("partials/guides.html", '<div class="container"><div id="guides"><div class="row"><div class="col-md-12"><div id="deals-primary-photo"><img src="http://s3.postimg.org/y5bgj2bz7/header.jpg"><div id="deal-search" class="row"><div class="col-sm-6"><form class="form-inline">Kota Asal<select class="form-control"><option>Jakarta</option><option>Bali</option><option>Yogyakarta</option><option>Raja Ampat</option><option>Singapore</option></select></form></div><div class="col-sm-6 text-right">Mau tiket murah ke Jakarta? <a href="#" class="btn btn-primary">Pesan</a></div></div></div></div></div><div class="row"><div class="col-md-12"><h4>Atraksi Utama</h4></div></div><div class="row"><div class="col-sm-3 guides-item"><div class="guides-img"><img src="images/thumb-bali.jpg"><h3>Pellentesque</h3></div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id felis vulputate, convallis lectus quis, dignissim felis. Pellentesque lacinia ut quam non varius. Nulla et ex iaculis, dapibus nisl sed, ultrices neque. Fusce id mollis dui, nec mollis sem.</p></div><div class="col-sm-3 guides-item"><div class="guides-img"><img src="images/thumb-bali.jpg"><h3>Consectetur</h3></div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id felis vulputate, convallis lectus quis, dignissim felis. Pellentesque lacinia ut quam non varius. Nulla et ex iaculis, dapibus nisl sed, ultrices neque. Fusce id mollis dui, nec mollis sem.</p></div><div class="col-sm-3 guides-item"><div class="guides-img"><img src="images/thumb-bali.jpg"><h3>Adipiscingali</h3></div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id felis vulputate, convallis lectus quis, dignissim felis. Pellentesque lacinia ut quam non varius. Nulla et ex iaculis, dapibus nisl sed, ultrices neque. Fusce id mollis dui, nec mollis sem.</p></div><div class="col-sm-3 guides-item"><div class="guides-img"><img src="images/thumb-bali.jpg"><h3>Scelerisque</h3></div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id felis vulputate, convallis lectus quis, dignissim felis. Pellentesque lacinia ut quam non varius. Nulla et ex iaculis, dapibus nisl sed, ultrices neque. Fusce id mollis dui, nec mollis sem.</p></div></div></div></div>')
        }])
    }(),
    function(o) {
        try {
            o = angular.module("momotrip")
        } catch (a) {
            o = angular.module("momotrip", [])
        }
        o.run(["$templateCache", function(o) {
            o.put("partials/hotel.detail.html", '<div class="container"><div id="search-result" class="row"><div class="col-md-12"><div class="row"><div class="col-md-12" ng-show="loading"><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Loading data. Mohon Tunggu.</div></div></div></div><div class="row"><div class="col-md-12" ng-show="noresult"><div class="alert alert-info" role="alert">Maaf hotel yang anda maksud tidak ditemukan</div></div></div><div class="row"><div ng-show="hoteldetail" class="col-md-12">{{hoteldetail}}</div></div></div></div></div>')
        }])
    }(),
    function(o) {
        try {
            o = angular.module("momotrip")
        } catch (a) {
            o = angular.module("momotrip", [])
        }
        o.run(["$templateCache", function(o) {
            o.put("partials/hotel.html", '<div class="container"><div id="search-result" class="row"><div class="col-md-12"><div class="row"><div class="col-md-12" ng-show="loading"><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Loading data. Mohon Tunggu.</div></div></div></div><div class="row"><div class="col-md-12" ng-show="noresult"><div class="alert alert-info" role="alert">Maaf hotel yang anda cari tidak ditemukan <a href="#" class="btn btn-sm btn-primary">Cari Baru</a></div></div></div><div class="row" ng-show="hotelresult"><div class="col-sm-8 col-sm-push-4" ng-init="sortdep = \'price\'"><div class="row"><div class="col-md-12"><div class="hotel-sort-wrap"><h4>27 Hotel ditemukan di Denpasar</h4><div class="hotel-sort">Berdasarkan: <a>Rekomendasi</a> <a ng-click="sortdep = \'price\'; reverse=!reverse">Harga</a> <a ng-click="sortdep = \'rating\'; reverse=!reverse">Bintang</a></div></div></div></div><div class="hotel-result-item hotel-box" ng-repeat="hotel in hotelresult"><div class="row"><div class="hotel-item-thumb col-sm-3" ng-class="{ default: hotel.photo_primary == defaultPhoto }"><img src="{{hotel.photo_primary}}"></div><div class="hotel-item-summary col-sm-9"><div class="row"><div class="col-sm-6"><h2 class="hotel-item-title">{{hotel.name}}</h2><div class="hotel-item-meta"><div class="address">{{hotel.address}}</div><div class="hotel-star star-{{hotel.star_rating}}"></div><div class="map"><a ng-click="toggleMap{{hotel.id}} = !toggleMap{{hotel.id}}">Show map</a></div><modal title="{{hotel.name}}" visible="toggleMap{{hotel.id}}">{{hotel.address}}<map center="{{hotel.latitude}},{{hotel.longitude}}" zoom="16"><marker position="{{hotel.latitude}},{{hotel.longitude}}" title="{{hotel.name}}"></marker></map></modal></div></div><div class="col-sm-6"><div class="flight-price" ng-bind-html="hotel.price | customCurrency"></div><div class="pesan"><a href="#" class="btn btn-primary">PESAN</a></div></div></div></div></div></div></div><div class="col-sm-4 col-sm-pull-8"><div class="hotel-result-search hotel-box"><h2 class="hotel-box-title">Rincian Pencarian Hotel</h2><form name="hotelform" id="formhotel" role="form"><div class="form-group"><label for="hotelq">Nama Kota atau Hotel</label> <input type="text" name="hotelq" ng-model="hotel.q" placeholder="Ketik nama kota atau hotel" typeahead="hotel for hotel in hotelKeyword($viewValue)" typeahead-loading="loadingLocations" class="form-control input-sm" ng-required="true"></div><div class="form-group"><div class="row"><div class="col-md-6"><label for="hotelcheckin">Checkin:</label><div class="input-group"><input type="text" class="form-control input-sm" name="checkindate" datepicker-popup="dd/M/y" ng-model="hotel.startdate" min-date="hotelMinStartDate" is-open="hotelOpenStartDate" datepicker-options="dateOptions" show-button-bar="false" ng-required="true" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default btn-sm" ng-click="hotelOpenStart()"><i class="glyphicon glyphicon-calendar"></i></button></span></div></div><div class="col-md-6"><label for="hotelcheckin">Checkout:</label><div class="input-group"><input type="text" class="form-control input-sm" name="checkoutdate" datepicker-popup="dd/M/y" ng-model="hotel.enddate" min-date="hotelMinEndDate" is-open="hotelOpenEndDate" datepicker-options="dateOptions" init-date="hotelMinEndDate" show-button-bar="false" ng-required="true" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default btn-sm" ng-click="hotelOpenEnd()"><i class="glyphicon glyphicon-calendar"></i></button></span></div></div></div></div><div class="form-group"><div class="row"><div class="col-md-4"><div class="form-group"><label for="hotelroom">Kamar</label><select class="form-control input-sm" name="hotelroom" ng-model="hotel.room" ng-init="hotel.room = 1" required=""><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div></div><div class="col-md-4"><div class="form-group"><label for="hoteladult">Dewasa</label><select class="form-control input-sm" name="hoteladult" ng-model="hotel.adult" ng-init="hotel.adult = 1" required=""><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></div></div><div class="col-md-4"><div class="form-group"><label for="hotelchild">Anak</label><select class="form-control input-sm" name="hotelchild" ng-model="hotel.child" ng-init="hotel.child = 0" required=""><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option></select></div></div></div></div><div class="form-group"><button type="submit" class="btn btn-search btn-sm" ng-click="searchHotel()" ng-disabled="hotelform.$invalid">Cari Hotel</button></div></form></div><div class="hotel-result-filter hotel-box"><h2 class="hotel-box-title">Filter Pencarian</h2><div class="form-group"><label for="hotelq">Nama Hotel</label> <input type="text" class="form-control input-sm"></div><hr><div class="form-group"><span class="star-rating"><input type="radio" name="rating" value="1"><i></i> <input type="radio" name="rating" value="2"><i></i> <input type="radio" name="rating" value="3"><i></i> <input type="radio" name="rating" value="4"><i></i> <input type="radio" name="rating" value="5"><i></i></span></div><hr><p><strong>Tarif Rata-rata per Malam</strong></p><div class="radio"><label><input type="radio" name="radio"> Rp. 0 - Rp. 999.999</label></div><div class="radio"><label><input type="radio" name="radio"> Rp. 1.000.000 - Rp. 1.499.999</label></div><div class="radio"><label><input type="radio" name="radio"> Rp. 1.500.000 - Rp. 2.999.999</label></div><div class="radio"><label><input type="radio" name="radio"> Rp. 3.000.000 +</label></div></div></div></div></div></div><div id="hotel-detail"><div class="row"><div class="col-md-12"><div id="hotel-primary-photo"><img src="http://www.master18.tiket.com/img/default/d/e/default-default.crop.jpg"><h1 class="hotel-title">O-Ce-N Bali Hotel</h1></div></div></div><div id="hotel-meta" class="row border-bottom"><div class="col-sm-9 border-right"><div class="row"><div class="col-sm-12 hotel-meta-item border-bottom"><span class="hotel-star star-4"></span> | <span class="hotel-address"><strong>Intan Permai Street 18 , Kuta, Badung</strong></span></div></div><div class="row"><div class="col-sm-4 hotel-meta-item border-right"><strong>Jumlah kamar</strong>: 6</div><div class="col-sm-8 hotel-meta-item"><strong>Rating pengunjung</strong>: 9/10</div></div></div><div class="col-sm-3 hotel-meta-item text-center"><p>Harga Mulai Dari</p><div class="flight-price" ng-bind-html="896800.00 | customCurrency"></div></div></div><p>Kerobokan is now another suburb of Kuta, just north of Kuta, Legian and Seminyak. It is a mixed tourist/residential area on the west coast of Bali. Because of its, high density of boutique shopping, cultural and entertainment center and many clustered fine eating establishment, it has rapidly become one of the most well-known tourist areas on the island. There are few notable establishments in addition to few commercial strips with popular and lively restaurants, bars, villas and good crafts/furniture shop.</p><hr><div class="row"><div class="col-sm-8 col-sm-push-4"><div class="row"><div class="col-md-12"><div class="hotel-box text-center"><strong>Hasil Pencarian 25 Nov 2014 - 30 Nov 2014, 1 Kamar, 2 Dewasa</strong></div></div></div><div class="row"><div class="col-md-12"><div id="hotel-room"><h4>Pilih Kamar Anda</h4><div id="room-filter" class="row"><div class="col-sm-2"></div><div class="col-sm-4">Tipe Kamar</div><div class="col-sm-2">Jumlah</div><div class="col-sm-4">Harga</div></div><div class="room-item row"><div class="col-sm-2"><img src="http://www.master18.tiket.com/img/business/u/p/business-uppala-seminyak-07.s.jpg"></div><div class="col-sm-4">One Bedroom Suite</div><div class="col-sm-2"><select class="form-control input-sm"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="col-sm-4"><span class="flight-price" ng-bind-html="896800.00 | customCurrency"></span></div></div><div class="room-item row"><div class="col-sm-2"><img src="http://www.master18.tiket.com/img/business/u/p/business-uppala-seminyak-07.s.jpg"></div><div class="col-sm-4">One Bedroom Suite</div><div class="col-sm-2"><select class="form-control input-sm"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="col-sm-4"><span class="flight-price" ng-bind-html="896800.00 | customCurrency"></span></div></div><div class="room-item row"><div class="col-sm-2"><img src="http://www.master18.tiket.com/img/business/u/p/business-uppala-seminyak-07.s.jpg"></div><div class="col-sm-4">One Bedroom Suite</div><div class="col-sm-2"><select class="form-control input-sm"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="col-sm-4"><span class="flight-price" ng-bind-html="896800.00 | customCurrency"></span></div></div></div></div></div><div class="row"><div class="col-md-12"><p class="text-right"><a href="#" class="btn btn-primary">Lanjut</a></p></div></div></div><div class="col-sm-4 col-sm-pull-8"><div class="hotel-result-search hotel-box"><h2 class="hotel-box-title">Rincian Pencarian Hotel</h2><form name="hotelform" id="formhotel" role="form"><div class="form-group"><label for="hotelq">Nama Kota atau Hotel</label> <input type="text" name="hotelq" ng-model="hotel.q" placeholder="Ketik nama kota atau hotel" typeahead="hotel for hotel in hotelKeyword($viewValue)" typeahead-loading="loadingLocations" class="form-control input-sm" ng-required="true"></div><div class="form-group"><div class="row"><div class="col-md-6"><label for="hotelcheckin">Checkin:</label><div class="input-group"><input type="text" class="form-control input-sm" name="checkindate" datepicker-popup="dd/M/y" ng-model="hotel.startdate" min-date="hotelMinStartDate" is-open="hotelOpenStartDate" datepicker-options="dateOptions" show-button-bar="false" ng-required="true" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default btn-sm" ng-click="hotelOpenStart()"><i class="glyphicon glyphicon-calendar"></i></button></span></div></div><div class="col-md-6"><label for="hotelcheckin">Checkout:</label><div class="input-group"><input type="text" class="form-control input-sm" name="checkoutdate" datepicker-popup="dd/M/y" ng-model="hotel.enddate" min-date="hotelMinEndDate" is-open="hotelOpenEndDate" datepicker-options="dateOptions" init-date="hotelMinEndDate" show-button-bar="false" ng-required="true" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default btn-sm" ng-click="hotelOpenEnd()"><i class="glyphicon glyphicon-calendar"></i></button></span></div></div></div></div><div class="form-group"><div class="row"><div class="col-md-4"><div class="form-group"><label for="hotelroom">Kamar</label><select class="form-control input-sm" name="hotelroom" ng-model="hotel.room" ng-init="hotel.room = 1" required=""><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div></div><div class="col-md-4"><div class="form-group"><label for="hoteladult">Dewasa</label><select class="form-control input-sm" name="hoteladult" ng-model="hotel.adult" ng-init="hotel.adult = 1" required=""><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></div></div><div class="col-md-4"><div class="form-group"><label for="hotelchild">Anak</label><select class="form-control input-sm" name="hotelchild" ng-model="hotel.child" ng-init="hotel.child = 0" required=""><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option></select></div></div></div></div><div class="form-group"><button type="submit" class="btn btn-search btn-sm" ng-click="searchHotel()" ng-disabled="hotelform.$invalid">Cari Hotel</button></div></form></div></div></div></div></div>')
        }])
    }(),
    function(o) {
        try {
            o = angular.module("momotrip")
        } catch (a) {
            o = angular.module("momotrip", [])
        }
        o.run(["$templateCache", function(o) {
            o.put("partials/login.html", '&nbsp;<form name="loginForm" class="form-horizontal" role="form"><div class="form-group"><label class="col-sm-3 control-label no-padding-right" for="email">Email / Phone</label><div class="col-sm-7"><span class="block input-icon input-icon-right"><input type="text" class="form-control" placeholder="Email / Phone" name="email" ng-model="login.email" required="" focus=""> <i class="ace-icon fa fa-user"></i></span></div></div><div class="form-group"><label class="col-sm-3 control-label no-padding-right" for="password">Password</label><div class="col-sm-7"><span class="block input-icon input-icon-right"><input type="password" class="form-control" placeholder="Password" ng-model="login.password" required=""> <i class="ace-icon fa fa-lock"></i></span></div></div><div class="space"></div><div class="clearfix"><div class="row"><label class="col-sm-3 control-label no-padding-right"></label><div class="col-sm-7"><button type="submit" class="width-35 pull-right btn btn-sm btn-primary" ng-click="doLogin(login)" data-ng-disabled="loginForm.$invalid"><i class="ace-icon fa fa-key"></i> Login</button></div></div></div></form>&nbsp;')
        }])
    }(),
    function(o) {
        try {
            o = angular.module("momotrip")
        } catch (a) {
            o = angular.module("momotrip", [])
        }
        o.run(["$templateCache", function(o) {
            o.put("partials/main.html", '<div class="search-container"><div class="container"><div class="row"><div class="col-md-12"><h1>Cara Mudah Cari Tiket & Hotel Murah!</h1></div></div><div class="row"><div class="col-md-5 col-md-push-1 search-box-flight-wrap"><div class="search-box search-box-flight" ng-class="{\'zoom\':click==1, \'normal\':click==2}" ng-click="(click=1)"><h3>Cari Tiket Pesawat</h3><div class="text-center"><p class="btn-group"><button type="button" class="btn btn-default btn-ways" ng-class="{\'btn-focus\':btnClick==1, \'normal\':btnClick==2, \'btn-focus\':click==1}" ng-click="searchFlightOpt(\'oneway\'); (btnClick=1)">Sekali Jalan</button> <button type="button" class="btn btn-default btn-ways" ng-class="{\'btn-focus\':btnClick==2}" ng-click="searchFlightOpt(\'roundtrip\'); (btnClick=2)">Pulang Pergi</button></p></div><form name="flightform" id="formflight" role="form"><div class="form-group"><label for="d">Dari</label> <input type="text" name="dep" ng-model="flight.dep" placeholder="Ketik keberangkatan" typeahead="(airport.location_name + \' | \' + airport.airport_code) as (airport.location_name + \' - \' + airport.airport_code) for airport in airports | filter:$viewValue" typeahead-loading="loadingLocations" class="form-control" ng-required="true"></div><div class="form-group"><label for="a">Ke</label> <input type="text" name="arr" ng-model="flight.arr" placeholder="Ketik tujuan" typeahead="(airport.location_name + \' | \' + airport.airport_code) as (airport.location_name + \' - \' + airport.airport_code) for airport in airports | filter:$viewValue" typeahead-loading="loadingLocations" class="form-control" ng-required="true"></div><div class="form-hide"><div class="form-group"><div class="row" ng-hide="selectpricegraph"><div class="col-md-6"><label for="exampleInputEmail2">Pergi:</label><p class="input-group calendar-flat" ng-click="openStart()"><input type="text" class="form-control" name="date" datepicker-popup="d/M/y" ng-model="flight.date" min-date="minStartDate" is-open="openedddate" datepicker-options="dateOptions" show-button-bar="false" ng-required="true" close-text="Close" disabled=""> <span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="openStart()"><i class="glyphicon glyphicon-calendar"></i></button></span></p></div><div class="col-md-6"><label for="exampleInputEmail2" ng-show="selectreturn">Pulang:</label><p class="input-group calendar-flat" ng-show="selectreturn" ng-click="openEnd()"><input type="text" class="form-control" name="ret_date" datepicker-popup="d/M/y" ng-model="flight.ret_date" min-date="minEndDate" is-open="openedrdate" datepicker-options="dateOptions" init-date="minEndDate" show-button-bar="false" close-text="Close" disabled=""> <span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="openEnd()"><i class="glyphicon glyphicon-calendar"></i></button></span></p></div></div><div class="row"><div class="col-md-4"><label for="exampleInputEmail1">Dewasa</label><div class="input-group icon-dewasa"><select class="form-control" name="adult" ng-model="flight.adult" ng-init="flight.adult = 1" required=""><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div></div><div class="col-md-4"><label for="exampleInputEmail1">Anak</label><div class="input-group icon-anak"><select class="form-control" name="child" ng-model="flight.child" ng-init="flight.child = 0" required=""><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div></div><div class="col-md-4"><label for="exampleInputEmail1">Bayi</label><div class="input-group icon-bayi"><select class="form-control" name="infant" ng-model="flight.infant" ng-init="flight.infant = 0" required=""><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div></div></div></div><div class="form-group"><button type="submit" class="btn btn-search" ng-click="searchFlight()" ng-disabled="flightform.$invalid">Cari Pesawat</button></div></div></form></div></div><div class="col-md-5 col-md-push-1 search-box-hotel-wrap"><div class="search-box search-box-hotel" ng-class="{\'zoom\':click==2, \'normal\':click==1}" ng-click="(click=2)"><h3>Cari Hotel</h3><form name="hotelform" id="formhotel" role="form"><div class="form-group"><label for="hotelq">Nama Kota atau Hotel</label> <input type="text" name="hotelq" ng-model="hotel.q" placeholder="Ketik nama kota atau hotel" typeahead="hotel for hotel in hotelKeyword($viewValue)" typeahead-loading="loadingLocations" class="form-control" ng-required="true"></div><div class="form-hide"><div class="form-group"><div class="row"><div class="col-md-6"><label for="hotelcheckin">Checkin:</label><p class="input-group calendar-flat" ng-click="hotelOpenStart()"><input type="text" class="form-control" name="checkindate" datepicker-popup="dd/M/y" ng-model="hotel.startdate" min-date="hotelMinStartDate" is-open="hotelOpenStartDate" datepicker-options="dateOptions" show-button-bar="false" ng-required="true" close-text="Close" disabled=""> <span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="hotelOpenStart()"><i class="glyphicon glyphicon-calendar"></i></button></span></p></div><div class="col-md-6"><label for="hotelcheckin">Checkout:</label><p class="input-group calendar-flat" ng-click="hotelOpenEnd()"><input type="text" class="form-control" name="checkoutdate" datepicker-popup="dd/M/y" ng-model="hotel.enddate" min-date="hotelMinEndDate" is-open="hotelOpenEndDate" datepicker-options="dateOptions" init-date="hotelMinEndDate" show-button-bar="false" ng-required="true" close-text="Close" disabled=""> <span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="hotelOpenEnd()"><i class="glyphicon glyphicon-calendar"></i></button></span></p></div></div></div><div class="form-group"><div class="row"><div class="col-md-4"><label for="hotelroom">Kamar</label><select class="form-control" name="hotelroom" ng-model="hotel.room" ng-init="hotel.room = 1" required=""><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div><div class="col-md-4"><label for="hoteladult">Dewasa</label><select class="form-control" name="hoteladult" ng-model="hotel.adult" ng-init="hotel.adult = 1" required=""><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></div><div class="col-md-4"><label for="hotelchild">Anak</label><select class="form-control" name="hotelchild" ng-model="hotel.child" ng-init="hotel.child = 0" required=""><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option></select></div></div></div><div class="form-group"><button type="submit" class="btn btn-search" ng-click="searchHotel()" ng-disabled="hotelform.$invalid">Cari Hotel</button></div></div></form></div></div></div></div></div><div id="fitur" class="container"><div class="row"><div id="fitur-mudah" class="fitur-item col-sm-4"><img src="images/icon-mudah.png"><div class="fitur-desc"><h5>Mudah</h5><p>Pembelian tiket menjadi semakin fleksibel dengan berbagai pilihan pembayaran; dari Transfer ATM, Kartu Kredit hingga Internet Banking.</p></div></div><div id="fitur-murah" class="fitur-item col-sm-4"><img src="images/icon-murah.png"><div class="fitur-desc"><h5>Murah</h5><p>Harga tiket pesawat yang ditampilkan sudah termasuk biaya-biaya seperti pajak, Iuran Wajib Jasa Raharja dan fuel surcharge.</p></div></div><div id="fitur-terpercaya" class="fitur-item col-sm-4"><img src="images/icon-terpecaya.png"><div class="fitur-desc"><h5>Terpercaya</h5><p>Teknologi SSL dari RapidSSL dengan Sertifikat yang terotentikasi menjamin privasi dan keamanan transaksi Anda.</p></div></div></div></div><div class="destination"><div class="container"><div class="row"><div class="col-md-12"><h2>Destinasi Populer Momotrip</h2></div></div><div class="row"><div class="col-md-6 dest-item dest-item-primary"><div class="dest-img"><img src="images/thumb-singapore.jpg"><h3>Singapore</h3></div></div><div class="col-md-3 dest-item"><div class="dest-img"><img src="images/thumb-bali.jpg"><h3>Bali</h3></div></div><div class="col-md-3 dest-item"><div class="dest-img"><img src="images/thumb-yogya.jpg"><h3>Jogjakarta</h3></div></div></div><div class="row"><div class="col-md-3 dest-item"><div class="dest-img"><img src="images/thumb-bandung.jpg"><h3>Bandung</h3></div></div><div class="col-md-3 dest-item"><div class="dest-img"><img src="images/thumb-malang.jpg"><h3>Malang</h3></div></div><div class="col-md-3 dest-item"><div class="dest-img"><img src="images/thumb-kualalumpur.jpg"><h3>Kuala Lumpur</h3></div></div><div class="col-md-3 dest-item"><div class="dest-img"><img src="images/thumb-makasar.jpg"><h3>Makasar</h3></div></div></div><div class="row"><div class="col-md-3 dest-item"><div class="dest-img"><img src="images/thumb-medan.jpg"><h3>Medan</h3></div></div><div class="col-md-3 dest-item"><div class="dest-img"><img src="images/thumb-surabaya.jpg"><h3>Surabaya</h3></div></div><div class="col-md-6 dest-item dest-item-primary"><div class="dest-img"><img src="images/thumb-papuabarat.jpg"><h3>Raja Ampat</h3></div></div></div><div class="row"><div class="col-md-12"><h4><a href="#">Lihat semua destinasi populer</a></h4>{{token}}</div></div></div></div>')
        }])
    }(),
    function(o) {
        try {
            o = angular.module("momotrip")
        } catch (a) {
            o = angular.module("momotrip", [])
        }
        o.run(["$templateCache", function(o) {
            o.put("partials/signup.html", '<form name="signupForm" class="form-horizontal" role="form"><div class="form-group"><label class="col-sm-5 control-label no-padding-right" for="email">Email</label><div class="col-sm-7"><span class="block input-icon input-icon-right"><input type="text" class="form-control" placeholder="Email" name="email" ng-model="signup.email" focus=""> <span ng-show="signupForm.email.$error.email" class="help-inline">Email is not valid</span></span></div></div><div class="form-group"><label class="col-sm-5 control-label no-padding-right" for="password">Password</label><div class="col-sm-7"><span class="block input-icon input-icon-right"><input type="password" class="form-control" name="password" placeholder="Password" ng-model="signup.password" required=""> <small class="errorMessage" data-ng-show="signupForm.password.$dirty && signupForm.password.$invalid">Enter Password.</small></span></div></div><div class="form-group"><label class="col-sm-5 control-label no-padding-right" for="password2">Confirm Password</label><div class="col-sm-7"><span class="block input-icon input-icon-right"><input type="password" class="form-control" name="password2" placeholder="Password Again" ng-model="signup.password2" password-match="signup.password" required=""> <small class="errorMessage" data-ng-show="signupForm.password2.$dirty && signupForm.password2.$error.required">Enter password again.</small> <small class="errorMessage" data-ng-show="signupForm.password2.$dirty && signupForm.password2.$error.passwordNoMatch && !signupForm.password2.$error.required">Password do not match.</small></span></div></div><div class="form-group"><label class="col-sm-5 control-label no-padding-right" for="name">Name</label><div class="col-sm-7"><span class="block input-icon input-icon-right"><input type="text" class="form-control" placeholder="Name" ng-model="signup.name"></span></div></div><div class="form-group"><label class="col-sm-5 control-label no-padding-right" for="phone">Phone</label><div class="col-sm-7"><span class="block input-icon input-icon-right"><input type="text" class="form-control" placeholder="Phone" name="phone" ng-model="signup.phone"></span></div></div><div class="form-group"><label class="col-sm-5 control-label no-padding-right" for="address">Address</label><div class="col-sm-7"><span class="block input-icon input-icon-right"><input type="text" class="form-control" placeholder="Address" ng-model="signup.address"></span></div></div><div class="form-group"><span class="lbl col-sm-5"></span><div class="col-sm-7"><button type="submit" class="width-35 pull-right btn btn-sm btn-primary" ng-click="signUp(signup)" data-ng-disabled="signupForm.$invalid">Sign Up</button></div></div><span class="lbl col-sm-5"></span><div class="col-sm-7">Already have an account? <a href="#/login">SignIn</a></div></form>')
        }])
    }();
