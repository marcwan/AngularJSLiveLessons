(function() {


    function AlbumViewerController ($scope, $routeParams, AlbumProvider) {
        $scope.album_name = $routeParams.album_name;

        try {
            var album = AlbumProvider.getAlbumByName($scope.album_name);
            $scope.photos = album.photos;
        } catch (e) {
            if (e.message == "no_such_album")
                $scope.page_loading_error = "I don't know about that album yet, sorry";
            else
                $scope.page_loading_error = "Unexpected error. Bug!";
        }
    }


    photoApp.controller("AlbumViewerController", AlbumViewerController);

})();
