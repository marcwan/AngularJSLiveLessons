(function() {

    function AlbumListController ($scope, AlbumProvider) {

        $scope.new_album = {};
        $scope.add_error_text = '';

        $scope.albums = AlbumProvider.getAlbums();

        $scope.addAlbum = function (album_data) {
            try {
                AlbumProvider.addAlbum(album_data);
                $scope.new_album = {};
                $scope.add_error_text = '';

            } catch (e) {
                if (e.message == "missing_title")
                $scope.add_error_text = "Missing title";
                else if (e.message == "bad_date")
                    $scope.add_error_text = "You must specify a date (yyyy/mm/dd)";
                else if (e.message == "missing_description")
                    $scope.add_error_text = "Missing description";
                else if (e.message == "bad_name")
                    $scope.add_error_text = "Short album name must be at least 6 chars (ironic, yes)";
            }
        };
    }

    photoApp.controller("AlbumListController", AlbumListController);

})();
