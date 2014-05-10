(function () {

    function albumProvider ($http, $fileUploader) {

        var album_cache = {};

        this.getUploader = function (album_name, scope) {
            return $fileUploader.create({
                scope: scope,
                method: "PUT",
                url: "/v1/albums/" + album_name + "/photos.json"
            });
        };

        this.albumChanged = function (name) {
            if (album_cache[name]) delete album_cache[name];
        };

        this.getAlbums = function (callback) {
            $http.get("/v1/albums.json")
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

        this.getAlbum = function (name, callback) {
            if (album_cache[name]) return callback(null, album_cache[name]);

            $http.get("/v1/albums/" + name + ".json")
                .success(function (data, status, headers, conf) {
                    album_cache[name] = data;
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

        this.getPhotosForAlbum = function (name, callback) {
            if (album_cache[name]) return callback(null, album_cache[name].photos);

            $http.get("/v1/albums/" + name + "/photos.json")
                .success(function (data, status, headers, conf) {
                    album_cache[name] = data;
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };


        this.addAlbum = function (album_data, callback) {

            if (!album_data.name) return callback({ code: "missing_name" });
            if (!album_data.title) return callback({ code: "missing_title" });
            if (!album_data.description) return callback({ code: "missing_description" });
            if (!album_data.date) return callback({ code: "missing_date" });
            if (!is_valid_date(album_data.date)) return callback({ code: "bad_date" });

            $http.put("/v1/albums.json", album_data)
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };
    }

    photoApp.service("albumProvider", albumProvider);





function is_valid_date(the_date) {
    if (the_date.match(/^[0-9]{2,4}[\-\/\. ,][0-9]{1,2}[\-\/\. ,][0-9]{1,2}$/)) {
        var d = new Date(the_date);
        return !isNaN(d.getTime());
    } else {
        return false;
    }
}



})();
