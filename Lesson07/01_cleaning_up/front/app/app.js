var photoApp = angular.module("photoSharingApp", [ "ngRoute", "angularFileUpload", "ngCookies", 'ui.bootstrap' ]);


photoApp.config(function ($routeProvider) {
    $routeProvider
        .when("/albums", { controller: "AlbumListController", templateUrl: "app/partials/album_list_partial.html" })
        .when("/album/:album_name", { controller: "AlbumViewController", templateUrl: "app/partials/album_view_partial.html" })
        .when("/album/:album_name/photo/:filename", { controller: "PhotoViewController", templateUrl: "app/partials/photo_view.html" })
        .when("/album/:album_name/upload", { controller: "AlbumUploadController", templateUrl: "app/partials/album_uploader.html" })
        .when("/", { redirectTo: "/albums" })
        .when("/404_page", { controller: "Controller404", templateUrl: "app/partials/404_page_partial.html" })
        .otherwise( { redirectTo: "/404_page" });
});



photoApp.directive('keypressEvents', [
  '$document',
  '$rootScope',
  function($document, $rootScope) {
    return {
      restrict: 'A',
      link: function() {
        $document.bind('keydown', function(e) {
          console.log('Got keypress:', e.which);
          $rootScope.$broadcast('keypress', e);
          $rootScope.$broadcast('keypress:' + e.which, e);
        });
      }
    };
  }
]);


photoApp.filter("OLD_YELLER", function () {
    return function (str) {
        if (typeof str != "string") return str;
        return str.toUpperCase();
    }
});





photoApp.filter("pluralise", function () {
    return function (ct, noun_rules) {
        var out= "" + ct + " ";

        if (!noun_rules.sing || !noun_rules.plur) {
            console.error("pluralise filter being called incorrectly");
            return ct;
        }

        if (ct == 1)
            out += noun_rules.sing;
        else
            out += noun_rules.plur;

        return out;
    }
});




photoApp.filter("multifieldfilter", function () {
    return function (obj, params) {
        if (!Array.isArray(obj)) return obj;
        if (!params.findMe) return obj;
        if (!params.fields || !Array.isArray(params.fields)) return obj;

        var out = [];

        var sf = params.findMe.toLowerCase();

        for (var i = 0; i < obj.length; i++) {
            for (var j = 0; j < params.fields.length; j++) {
                if (typeof obj[i][params.fields[j]] != 'string') break;
                if (obj[i][params.fields[j]].toLowerCase().indexOf(sf) != -1) {
                    out.push(obj[i]);
                    break;
                }
            }
        }

        return out;
    }
});

photoApp.directive("paAngry", function () {
    return {
        restrict: "A",
        link: function ($scope, element, attrs) {
            element.css({
                "background-color": "yellow",
                color: "red",
                padding: "10px",
                "font-weight": "bold"
            });
        }
    };
});


photoApp.directive("paAngryPlus", function () {
    return {
        restrict: "A",
        template: "&gt;:( &gt;:( &gt;:( <span ng-transclude></span> !!!!",
        transclude: true,
        link: function ($scope, element, attrs) {
            element.css({
                "background-color": "yellow",
                color: "red",
                padding: "10px",
                "font-weight": "bold"
            });
        }
    };
});



photoApp.directive("paAlbum", function () {
    return {
        restrict: "AE",
        scope: {
            albumdata: "="
        },
        templateUrl: "/app/partials/pa-album-directive.html",
        link: function ($scope, element, attrs) {
            // do nothing
        }
    }        
});

