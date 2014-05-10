(function() {


    function AlbumViewerController ($scope, $routeParams) {
        $scope.album_name = $routeParams.album_name;

        switch ($routeParams.album_name) {
          case "madrid1309":
            $scope.photos = [ 
                { filename: "madrid1309-001.jpg",
                  date: "2013/09/05",
                  description: "I love this place" },
                { filename: "madrid1309-002.jpg",
                  date: "2013/09/05",
                  description: "so much winning!!!" } ];
            break;
        default:
            $scope.page_loading_error = "I don't know about that album yet, sorry";
        }

    }


    photoApp.controller("AlbumViewerController", AlbumViewerController);

})();
