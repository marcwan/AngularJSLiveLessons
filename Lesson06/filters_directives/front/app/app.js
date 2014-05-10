var photoApp = angular.module("photoSharingApp", [ "ngRoute", 'angularFileUpload' ]);

photoApp.config(function ($routeProvider) {
    $routeProvider
        .when("/albums",  { controller: "AlbumListController", templateUrl: "/app/partials/album_list.html" })
        .when("/album/:album_name",  { controller: "AlbumViewerController", templateUrl: "/app/partials/album_viewer.html" })
        .when("/album/:album_name/upload",  { controller: "AlbumUploadController", templateUrl: "/app/partials/album_uploader.html" })
        .when("/album/:album_name/photos/:photo_filename",  { controller: "PhotoViewerController", templateUrl: "/app/partials/photo_viewer.html" })
        .when("/",  { redirectTo: "/albums" })
        .otherwise({ redirectTo: "/404_page" });
});



photoApp.filter("OLD_YELLER", function () {
    return function (str) {
        if (typeof str != 'string') return str;
        return str.toUpperCase();
    }
});


photoApp.filter("pluralise", function () {
    return function (count, nouns) {
        if (count == 1) return count + " " + nouns.one;
        else return count + " " + nouns.more;
    }
});

photoApp.filter("multifieldfilter", function () {
    return function (obj, params) {
        if (!Array.isArray(obj)) return obj;

        if (!params.findMe) return obj;
        if (!params.fields || !Array.isArray(params.fields)) return obj;

        var out = [];

        for (var i = 0; i < obj.length; i++) {
            for (var j = 0; j < params.fields.length; j++) {
                if (typeof obj[i][params.fields[j]] != 'string') break;
                if (obj[i][params.fields[j]].indexOf(params.findMe) != -1) {
                    out.push(obj[i]);
                    break;
                }
            }
        }

        return out;
    }
});


photoApp.directive("mwAngry", function () {
    return {
        restrict: "A",
        link: function ($scope, element, attrs) {
            element.css({ "background-color": "yellow",
                          color: "red" ,
                          padding: "10px" ,
                          "font-weight": "bold"  });
            
        }
    }
});


photoApp.directive("mwAngryPlus", function () {
    return {
        restrict: "AE",
        template: "&gt;:(&gt;:(&gt;:( <span ng-transclude></span>",
        transclude: true,
        link: function ($scope, element, attrs) {
            element.css({ "background-color": "yellow",
                          color: "red" ,
                          padding: "10px" ,
                          "font-weight": "bold"  });
            
        }
    }
});



photoApp.directive("paAlbum", function () {
    return {
        restrict: "AE",
        scope: {
            album: "="
        },
        template: "<div class='album panel panel-primary'><div class='panel-heading'>{{album.title}}</div><div class='panel-body'>{{album.description}}</div></div>",
        link: function ($scope, element, attrs) {
            // don't need to do anything here.
        }
    }
});
