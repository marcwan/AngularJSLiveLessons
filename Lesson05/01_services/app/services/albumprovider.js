(function () {

    function albumProvider () {

        var albums = [ 
            { 
                name: 'madrid1309',
                title: 'Weekend in Madrid',
                date: '2013-09-01',
                description: 'My favourite trip',
                photos: [
                    {
                        filename: "madrid1309-001.jpg",
                        date: "2013/09/05",
                        description: "I love this place, so much good food." },
                    { 
                        filename: "madrid1309-002.jpg",
                        date: "2013/09/06",
                        description: "The museo del prado we had a wonderful time here."
                    }
                ]
            },
            {
                name: 'iceland1404',
                title: 'Holiday in Iceland',
                date: '2014-04-15',
                description: 'This place is cold',
                photos: [
                    {
                        filename: "iceland1404-001.jpg",
                        date: "2014/04/14",
                        description: "So cold and so much snow!" },
                    {
                        filename: "iceland1404-002.jpg",
                        date: "2014/04/15",
                        description: "The northern lights are extremely clear here."
                    }
                ]
            },
            {
                name: 'thailand1210',
                title: 'Surfing in Thailand',
                date: '2012-10-01',
                description: 'So hot!',
                photos: [
                    {
                        filename: "thailand1210-001.jpg",
                        date: "2012/10/01",
                        description: "Getting mah surf on!"
                    },
                    {
                        filename: "thailand1210-002.jpg",
                        date: "2012/10/02",
                        description: "Thai food FTW!!!11!one!1"
                    }
                ]
            },
            {
                name: 'australia1207',
                title: 'Wedding in Australia',
                date: '2012-07-31',
                description: 'So many kangaroos and koalas!',
                photos: [
                    {
                        filename: "australia1207-001.jpg",
                        date: "2012/07/25",
                        description: "The wedding was lovely."
                    },
                    {
                        filename: "australia1207-002.jpg",
                        date: "2012/07/27",
                        description: "Great Ocean Road."
                    }
                ]
            }
        ];

        this.getAlbums = function () {
            return albums;
        };

        this.addAlbum = function (album_data) {
            for (var i = 0; i < albums.length; i++) {
                if (albums[i].name == album_data.name)
                    throw new Error("duplicate_album_name");
            }

            if (!album_data.title) throw new Error("missing_title");
            if (!album_data.description) throw new Error("missing_description");
            if (!album_data.date) throw new Error("bad_date");

            var d = new Date(album_data.date.trim());
            if (isNaN(d.getTime())) throw new Error("bad_date");
            albums.push(JSON.parse(JSON.stringify(album_data)));
        };


        this.getAlbumByName = function (name) {
            for (var i = 0; i < albums.length; i++) {
                if (albums[i].name == name)
                    return JSON.parse(JSON.stringify(albums[i]));
            }

            throw new Error("no_such_album");
        };
    }

    photoApp.service("albumProvider", albumProvider);

})();
