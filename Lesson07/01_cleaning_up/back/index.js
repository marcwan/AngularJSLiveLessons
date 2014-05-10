/**
 */
var express = require('express'),
    async = require("async"),
    fs = require('fs'),
    path = require('path');

var _port = 8082;
var _filename = "photo_albums.json";

var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(__dirname + "/../front"));


var photo_album_tree;

try {
    photo_album_tree = JSON.parse(fs.readFileSync(_filename).toString());
} catch (e) {
    console.error("\nFAILED TO LOAD " + _filename + ", Init to []\n");
    photo_album_tree = [];
}


app.get("/v1/albums.json", function (req, res) {
    send_success_resp(res, photo_album_tree);
});

/**
 * title
 * name
 * description
 * date
 */
app.put("/v1/albums.json", function (req, res) {

    if (!req.body || !req.body.title)
        return send_error_resp(res, 400, "missing_data", "Specify a title.");
    else if (!req.body.description)
        return send_error_resp(res, 400, "missing_data", "Specify a description.");
    else if (!req.body.name)
        return send_error_resp(res, 400, "missing_data", "Specify a name.");
    else if (!req.body.date)
        return send_error_resp(res, 400, "missing_data", "Specify a date.");
    else {
        if (isNaN((new Date(req.body.date)).getTime()))
            return send_error_resp(res, 400, "missing_data", "Invalid date.");

        if (album_by_name(req.body.name))
            return send_error_resp(res, 400, "invalid_data", "Duplicate album name.");
            
        // okay, add it to the end.
        var al = {
            name: req.body.name,
            title: req.body.title,
            date: req.body.date,
            description: req.body.description,
            photos: []
        };

        mkdirs_for_album(req.body.name, function (err, results) {
            if (err) return send_mkdir_error(res, err, req.body.name);
            photo_album_tree.push(JSON.parse(JSON.stringify(al)));
            fs.writeFileSync(_filename, JSON.stringify(photo_album_tree, null, 2));
            return send_success_resp(res, al);
        });
    }
});


app.post("/v1/albums/:album_name.json", function (req, res) {
    if (!req.body)
        return send_error_resp(res, 400, "missing_data", "You have to change at least sth.");
    if (req.body.date) {
        if (isNaN((new Date(req.body.date)).getTime()))
            return send_error_resp(res, 400, "missing_data", "Invalid date.");
    } 

    var album = album_by_name(req.params.album_name);
    if (!album)
        return send_error_resp(res, 404, "not_found", "No such album");

    var rbn = req.body.name;
    if (rbn && rbn.toLowerCase() != req.params.album_name.toLowerCase()) {
        // if they gave us a new name, makes sure it's not a dupe
        // okay to change case of current name
        if (album_by_name(req.body.name))
            return send_error_resp(res, 400, "invalid_data", "Duplicate album name.");
    }

    if (req.body.name) album.name = req.body.name;
    if (req.body.date) album.date = req.body.date;
    if (req.body.title) album.title = req.body.title;
    if (req.body.description) album.description = req.body.description;
    fs.writeFileSync(_filename, JSON.stringify(photo_album_tree, null, 2));
    return send_success_resp(res, album);
});



app.get("/v1/albums/:album_name.json", function (req, res) {
    var rpan = req.params.album_name;
    var album = album_by_name(rpan);
    if (!album)
        return send_error_resp(res, 404, "not_found", "No such album");

    return send_success_resp(res, album);
});


app.get("/v1/albums/:album_name/photos.json", function (req, res) {
    var rpan = req.params.album_name;
    var album = album_by_name(rpan);
    if (!album)
        return send_error_resp(res, 404, "not_found", "No such album");

    return send_success_resp(res, album.photos);
});



app.put("/v1/albums/:album_name/photos.json", function (req, res) {

    if (!req.body || !req.body.filename)
        return send_error_resp(res, 400, "missing_data", "Specify a filename.");
    else if (!req.body.description)
        return send_error_resp(res, 400, "missing_data", "Specify a description.");
    else if (!req.body.date)
        return send_error_resp(res, 400, "missing_data", "Specify a date.");
    else {
        if (isNaN((new Date(req.body.date)).getTime()))
            return send_error_resp(res, 400, "missing_data", "Invalid date.");

        var rpan = req.params.album_name;
        var album = album_by_name(rpan);
        if (!album)
            return send_error_resp(res, 404, "not_found", "No such album");

        if (!album.photos) album.photos = [];
        if (photo_in_album_by_filename(req.params.album_name, req.body.filename)) {
            return send_error_resp(res, 400, "invalid_data",
                                   "Duplicate filename for album.");
        }

        // before i modify the array, copy the file to the media 
        // location.
        var upfn = req.files.file.path;
        copy_file_to_destinations(upfn, rpan, req.body.filename, function (err) {
            if (err) {
                return send_filecopy_error(res, err);
            } else {
                // it's good, add it.
                var p = {
                    filename: req.body.filename,
                    date: req.body.date,
                    description: req.body.description
                };
                album.photos.push(p);
                fs.writeFileSync(_filename, JSON.stringify(photo_album_tree, null, 2));
                return send_success_resp(res, p);
            }
        });
    }
});



/**
 * Currently don't support changing image filename.
 */
app.post("/v1/albums/:album_name/photos/:filename.json", function (req, res) {
    if (!req.body)
        return send_error_resp(res, 400, "missing_data", "You have to change at least sth.");
    if (req.body.date) {
        if (isNaN((new Date(req.body.date)).getTime()))
            return send_error_resp(res, 400, "missing_data", "Invalid date.");
    }

    // make sure the album exists
    var album = album_by_name(req.params.album_name);
    if (!album)
        return send_error_resp(res, 404, "not_found", "No such album");

    var photo = photo_in_album_by_filename(album.name, req.params.filename);
    if (!photo)
        return send_error_resp(res, 404, "not_found", "No such photo");

    if (req.body.filename
        && req.body.filename.toLowerCase() != photo.filename.toLowerCase())
        return send_error_resp(res, 400, "not_supported", "Can't edit filenames yet");

    if (req.body.description) album.description = req.body.description;
    if (req.body.date) album.date = req.body.date;
    fs.writeFileSync(_filename, JSON.stringify(photo_album_tree, null, 2));
    return send_success_resp(res, photo);
});









/**
 * res, http_status, code, message
 * res, http_status, err obj
 * res, err obj
 */
function send_error_resp() {
    var res, http_status, code, message;
    if (arguments.length == 4) {
        res = arguments[0];
        http_status = arguments[1];
        code = arguments[2];
        message = arguments[3];
    } else if (arguments.length == 3) {
        res = arguments[0];
        http_status = arguments[1];
        code = arguments[2].error;
        message = arguments[2].message;
    } else if (arguments.length == 2) {
        res = arguments[0];
        http_status = _http_code_from_error(arguments[1].error);
        code = arguments[1].error;
        message = arguments[1].message;
    } else {
        console.error("send_error_resp: YOU'RE DOING IT WRONG");
        throw new Error("send_error_resp called wrong-est-ly");
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(http_status, JSON.stringify({ error: code, message: message }));
    res.end();
}

function send_success_resp(res, obj) {
    if (arguments.length != 2) {
        console.error("send_success_resp: YOU'RE DOING IT WRONG");
        throw new Error();
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(200, JSON.stringify(obj));
    res.end();
}


function _http_code_from_error (error_code) {
    switch (error_code) {
      // add other messages here when they're not server problems.
      default:
        return 503;
    }
}




console.error("Starting Server.");
app.listen(_port);






function album_by_name (name) {
    for (var i = 0; i < photo_album_tree.length; i++) {
        var pati = photo_album_tree[i];
        if (pati.name.toLowerCase() == name.toLowerCase())
            return pati;
    }

    return null;
}

function photo_in_album_by_filename (album, filename) {
    var a = album_by_name(album);
    if (!a) return null;

    if (!a.photos) a.photos = [];
    for (var i = 0; i < a.photos.length; i++) {
        var api = a.photos[i];
        if (api.filename.toLowerCase() == filename.toLowerCase())
            return api;
    }

    return null;
}


function copy_file (oldPath, newPath, callback) {

    oldPath = path.normalize(oldPath);
    newPath = path.normalize(newPath);

    fs.readFile(oldPath, function(err, data) {
        if (err) return callback(err);
        fs.writeFile(newPath, data, function(err) {
            if (err) return callback(err);
            callback(null);
        }); 
    });
}
function send_filecopy_error(res, err) {
    return send_error_resp(res,
                           503,
                           "file_copy_error",
                           "Couldn't copy file (" + err.code + ")");
}


function send_mkdir_error(res, err, aname) {
    console.error("Error making folders for: " + aname + ":");
    console.error(err);
    return send_error_resp(res, 
                           503,
                           "file_mkdir_error",
                           "Couldn't make image folder (" + err.code + ") for " + aname);
}


function mkdirs_for_album (album_name, callback) {

    var dirs = [
        __dirname + "/../front/media/" + album_name,
        __dirname + "/../front/media/" + album_name + "/thumb",
        __dirname + "/../front/media/" + album_name + "/full"
    ];

    async.eachSeries(
        // for each folder
        dirs,
        // call this function to create the folder
        function (item, cb) {
            fs.mkdir(item, function (err) {
                if (err && err.code != "EEXISTS")  // this is ok
                    cb(err);
                else
                    cb(null);
            });
        },
        // when all are done OR there was an error, this is called
        function (err) {
            if (err) {
                // try basic clean up, ignore any problems
                for (var i = dirs.length - 1; i >= 0 ; i--) {
                    fs.rmdir(dirs[i]);
                }
            }
            callback(err);
        }
    );
}


/**
 * UNDONE: make thumbnails!!!
 */
function copy_file_to_destinations (uploadfn, album_name, destfn, callback) {
    var np1 = __dirname + "/../front/media/" + album_name + "/thumb/" + destfn;
    var np2 = __dirname + "/../front/media/" + album_name + "/full/" + destfn;

    copy_file(uploadfn, np1, function (err, results) {
        if (err) {
            console.error("copy file error:");
            console.error(err);
            return callback(err);
        }
        copy_file(uploadfn, np2, function (err) {
            if (err) {
                console.error("copy file error:");
                console.error(err);
                fs.unlink(np1);
                return callback(err);
            }

            return callback(null);
        });
    });
}
