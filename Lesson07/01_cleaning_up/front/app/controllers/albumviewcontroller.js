(function () {


    function AlbumViewController ($scope, $routeParams, albumProvider) {
        $scope.load_error_text = "";
        $scope.album_name = $routeParams.album_name;
        $scope.page_load_error = "";
        $scope.album = null;

        albumProvider.getAlbum($scope.album_name, function (err, album) {
            if (err) {
                if (err.code == "not_found")
                    $scope.page_load_error = "No such album. Are you doing this right?";
                else
                    $scope.page_load_error = "Unexpected error loading page: " + err.code + " " + err.message;
            } else {
                $scope.album = album;
            }
        });

    }


    photoApp.controller("AlbumViewController", AlbumViewController);

})();
