(function() {

    function AlbumListController ($scope) {

        $scope.new_album = {};
        $scope.add_error_text = '';

        $scope.albums = [ 
            { name: 'madrid1309', title: 'Weekend in Madrid', date: '2013-09-01', description: 'My favourite trip' },
            { name: 'iceland1404', title: 'Holiday in Iceland', date: '2014-04-15', description: 'This place is cold' },
            { name: 'thailand1210', title: 'Surfing in Thailand', date: '2012-10-01', description: 'So hot!' },
            { name: 'australia1207', title: 'Wedding in Australia', date: '2012-07-31', description: 'So many kangaroos and koalas!' }
        ];

        $scope.addAlbum = function (album_data) {
            if (!album_data.title) 
                $scope.add_error_text = "Missing title";
            else if (!album_data.date)
                $scope.add_error_text = "You must specify a date (yyyy/mm/dd)";
            else if (!album_data.description)
                $scope.add_error_text = "Missing description";
            else if (!album_data.name)
                $scope.add_error_text = "Short album name must be at least 6 chars (ironic, yes)";
            else {
                try {
                    var d = new Date(album_data.date.trim());
                    if (isNaN(d.getTime())) throw new Error("invalid date");
                    // if we made it here the date is good
                    $scope.albums.push(album_data);
                    $scope.new_album = {};
                    $scope.add_error_text = '';
                } catch (e) {
                    $scope.add_error_text = "You must specify a valid date (yyyy/mm/dd)";
                }
            }
        };
    }

    photoApp.controller("AlbumListController", AlbumListController);

})();
