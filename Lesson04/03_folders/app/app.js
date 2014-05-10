var photoApp = angular.module("photoSharingApp", [ "ngRoute" ]);

photoApp.config(function ($routeProvider) {
    $routeProvider
        .when("/albums",  { controller: "AlbumListController", templateUrl: "/app/partials/album_list.html" })
        .when("/",  { redirectTo: "/albums" })
        .otherwise({ redirectTo: "/404_page" });
});

