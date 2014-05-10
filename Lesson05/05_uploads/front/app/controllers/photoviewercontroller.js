(function() {

    // what about date and description???
    // for next lesson!!!
    function PhotoViewerController ($scope, $routeParams) {
        $scope.album_name = $routeParams.album_name;
        $scope.photo_filename = $routeParams.photo_filename;
    }


    photoApp.controller("PhotoViewerController", PhotoViewerController);

})();
