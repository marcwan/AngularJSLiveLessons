(function () {


    function AlbumUploadController ($scope, $routeParams, albumProvider) {
        $scope.album_name = $routeParams.album_name;
        $scope.page_load_error = "";
        $scope.descriptions = {};

        albumProvider.getPhotosForAlbum($scope.album_name, function (err, photos) {
            if (err) {
                if (err.code == "not_found")
                    $scope.page_load_error = "No such album. Are you doing this right?";
                else
                    $scope.page_load_error = "Unexpected error loading page: " + err.code + " " + err.message;
            } else {
                $scope.photos = photos;
                $scope.uploader = albumProvider.getUploader($scope.album_name, $scope);

                $scope.uploader.bind("completeall", function (event, items) {
                    $scope.done_uploading = true;
                    albumProvider.albumChanged($scope.album_name);
                });


                $scope.uploader.bind("beforeupload", function (event, item) {
                    var fn = _fix_filename(item.file.name);
                    var d = item.file.lastModifiedDate;
                    var dstr = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate();

                    item.formData = [{
                        filename: fn,
                        date: dstr ? dstr : "",
                        description: $scope.descriptions[item.file.name]
                    }];
                });
            }
        });

    }

    photoApp.controller("AlbumUploadController", AlbumUploadController);



    /**
     * we'll be super fussy and only allow alnum, -, _, and .
     */
    function _fix_filename(fn) {
        if (!fn || fn.length == 0)  return "unknown";

        var r = new RegExp("^[a-zA-Z0-9\\-_.]+$");
        var out = "";

        for (var i = 0; i < fn.length; i++) {
            if (r.exec(fn[i]) != null)
                out += fn[i];
        }

        if (!out) out = "unknown_" + (new Date()).getTime();
        return out;
    }





})();
