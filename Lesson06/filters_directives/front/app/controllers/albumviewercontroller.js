(function() {

    function AlbumViewerController ($scope, $location, $routeParams, albumProvider) {
        $scope.album_name = $routeParams.album_name;
        $scope.page_load_error = "";

        albumProvider.getAlbumByName($scope.album_name, function (err, photos) {
            if (err) {
                if (err.error == "not_found")
                    $scope.page_load_error = "No such album. Are you calling this right?";
                else
                    $scope.page_load_error = "Unexpected error loading albums: " + err.message;
            } else {
                $scope.photos = photos;
            }
        });
    }

    photoApp.controller("AlbumViewerController", AlbumViewerController);

})();
