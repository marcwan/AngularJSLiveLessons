(function() {

    function AlbumListController ($scope, albumProvider, $location) {

        $scope.new_album = {};
        $scope.add_error_text = '';
        $scope.page_load_error = "";

        albumProvider.getAlbums(function (err, albums) {
            if (err) {
                $scope.page_load_error = "Unexpected error loading albums: " + e.message;
            } else {
                $scope.albums = albums;
            }
        });

        $scope.addAlbum = function (album_data) {

            albumProvider.addAlbum(album_data, function (err, results) {
                if (err) {
                    if (err.code == "missing_title")
                        $scope.add_error_text = "Missing title";
                    else if (err.code == "bad_date")
                        $scope.add_error_text = "You must specify a date (yyyy/mm/dd)";
                    else if (err.code == "missing_description")
                        $scope.add_error_text = "Missing description";
                    else if (err.code == "bad_name")
                        $scope.add_error_text = "Short album name must be at least 6 chars (ironic, yes)";
                } else {
                    // looks good!
                    $scope.new_album = {};
                    $scope.add_error_text = '';

                    // now, redirect to load in the album!
                    $location.path("/album/" + album_data.name);
                }

            });
        };
    }

    photoApp.controller("AlbumListController", AlbumListController);

})();
