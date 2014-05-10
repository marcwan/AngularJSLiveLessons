
describe('AlbumListControllerTest', function() {
    var scope, $httpBackend;//we'll use this scope in our tests

    var MockAlbumService =  {
        getAlbums: function (callback) {
            return callback(null, photo_albums);
        }
    };

    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('photoSharingApp'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller){
        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        $controller('AlbumListController', {$scope: scope, $location: null, albumProvider: MockAlbumService});
    }));

    describe("alc tests", function (){
        it("checking load", function () {
            expect(scope.albums.length).toBe(6);
            expect(scope.albums[0].name).toBe("asdfasfd");
        });
    });


    describe("filter test", function () {
        it("Should YELL", function () {
            inject(function (OLD_YELLERFilter) {
                expect(OLD_YELLERFilter("old")).toBe("OLD");
            });
        });
    });


    describe('directive tests', function() {
        it('should set background to yellow',
           inject(function($compile,$rootScope) {
               scope = $rootScope.$new();

               // get an element representation
               elem = angular.element("<span pa-angry>sample</span>");

               // create a new child scope
               scope = $rootScope.$new();

               // finally compile the HTML
               $compile(elem)(scope);

               // expect the background-color css property to be desirabe one
               expect(elem.css("background-color")).toEqual('yellow');
           })
          );
    });
});



var photo_albums = [
  {
    "name": "asdfasfd",
    "title": "asdf",
    "date": "2222/2/2",
    "description": "asdfasdf",
    "photos": [
      {
        "filename": "IMG_20140420_144009.jpg",
        "date": "2014/3/20",
        "description": "nice"
      },
      {
        "filename": "IMG_20140420_144013.jpg",
        "date": "2014/3/20",
        "description": "woo"
      },
      {
        "filename": "IMG_20140420_144029.jpg",
        "date": "2014/3/20",
        "description": "fun"
      },
      {
        "filename": "IMG_20140420_144034.jpg",
        "date": "2014/3/20",
        "description": "awesome"
      },
      {
        "filename": "IMG_20140420_154149.jpg",
        "date": "2014/3/20",
        "description": "asdfasdf"
      },
      {
        "filename": "IMG_20140420_154247.jpg",
        "date": "2014/3/20",
        "description": "dijpasdofij"
      },
      {
        "filename": "IMG_20140419_164913.jpg",
        "date": "2014/3/19",
        "description": "d1"
      },
      {
        "filename": "IMG_20140419_164918.jpg",
        "date": "2014/3/19",
        "description": "d2"
      },
      {
        "filename": "IMG_20140419_165222.jpg",
        "date": "2014/3/19",
        "description": "d3"
      },
      {
        "filename": "IMG_20140419_165227.jpg",
        "date": "2014/3/19",
        "description": "d4"
      },
      {
        "filename": "IMG_20140419_165746.jpg",
        "date": "2014/3/19",
        "description": "d5"
      },
      {
        "filename": "IMG_20140419_165750.jpg",
        "date": "2014/3/19",
        "description": "d6"
      },
      {
        "filename": "IMG_20140419_165754.jpg",
        "date": "2014/3/19",
        "description": "d7"
      },
      {
        "filename": "IMG_20140419_170230.jpg",
        "date": "2014/3/19",
        "description": "d8"
      },
      {
        "filename": "IMG_20130319_140649.jpg",
        "date": "2013/2/19",
        "description": "undefined"
      },
      {
        "filename": "IMG_20130319_154722.jpg",
        "date": "2013/2/19",
        "description": "undefined"
      },
      {
        "filename": "IMG_20130319_154829.jpg",
        "date": "2013/2/19",
        "description": "undefined"
      },
      {
        "filename": "IMG_20130319_163227.jpg",
        "date": "2013/2/19",
        "description": "undefined"
      },
      {
        "filename": "IMG_20130319_163229.jpg",
        "date": "2013/2/19",
        "description": "undefined"
      },
      {
        "filename": "IMG_20130319_163234.jpg",
        "date": "2013/2/19",
        "description": "undefined"
      }
    ]
  },
  {
    "name": "asdfasdf",
    "title": "sadfasdfasdf",
    "date": "2014/01/01",
    "description": "asodfipjas dofijas pdfoijas dfpoiasdjf apsoid",
    "photos": []
  },
  {
    "name": "qwerqwerqwre",
    "title": "qwerty",
    "date": "2014/1/2",
    "description": "asdofijp asdofija spdfoiasj f",
    "photos": []
  },
  {
    "name": "zxcvzxcvzxcv",
    "title": "zxcvzxcv",
    "date": "2013/3/3",
    "description": "asivpjoidjfaspdo fij",
    "photos": []
  },
  {
    "name": "fishyfish",
    "title": "fish",
    "date": "2013/4/5",
    "description": "asdfsf",
    "photos": []
  },
  {
    "name": "dogcatfish",
    "title": "dog cat",
    "date": "2012/3/5",
    "description": "asdiofjpasfoi",
    "photos": []
  }
];
