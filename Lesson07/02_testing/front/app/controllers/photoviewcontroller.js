(function () {

    function PhotoViewController ($scope, $routeParams, albumProvider, $location, $rootScope) {
        $scope.album_name = $routeParams.album_name;
        $scope.page_load_error = "";
        $scope.album = null;
        $scope.photo_filename = $routeParams.filename;
        $scope.photo_next_file = '';
        $scope.photo_prev_file = '';
        $scope.done_loading = false;
        $scope.description = '';

        $rootScope.$on("keypress:39", function (e, ke) {
            if ($scope.photo_next_file) {
                setTimeout(function () {
                    $scope.$apply(function () {$location.path("/album/" + $scope.album_name + "/photo/" + $scope.photo_next_file); });
                }, 200);
            };
        });

        $rootScope.$on("keypress:37", function (e, ke) {
            if ($scope.photo_prev_file) {
                setTimeout(function () {
                    $scope.$apply(function () {$location.path("/album/" + $scope.album_name + "/photo/" + $scope.photo_prev_file); });
                }, 200);
            }
        });

        albumProvider.getAlbum($scope.album_name, function (err, album) {
            if (err) {
                if (err.code == "not_found")
                    $scope.page_load_error = "No such album. Are you doing this right?";
                else
                    $scope.page_load_error = "Unexpected error loading page: " + err.code + " " + err.message;
            } else {
                $scope.album = album;
                for (var i = 0; i < album.photos.length; i++) {
                    if (album.photos[i].filename == $scope.photo_filename) {
                        $scope.description = album.photos[i].description;
                        if (i) $scope.photo_prev_file = album.photos[i -1].filename;
                        if (i < album.photos.length - 1)
                            $scope.photo_next_file = album.photos[i + 1].filename;
                        break;
                    }
                }

                if (i == album.photos.length)
                    $scope.page_load_error = "This photo does not appear to exist.";
                else
                    $scope.done_loading = true;
            }
        });

    }


    photoApp.controller("PhotoViewController", PhotoViewController);

})();
