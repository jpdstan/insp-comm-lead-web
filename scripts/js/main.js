(function () {
	var Post = function(header, author, date, text, imgLinks, index) {
        this.header = header;
        this.author = author;
        this.date   = date;
        this.text   = text;
        this.links  = imgLinks;
        this.index  = index;
	}

    Post.prototype.getDatePlain = function() {
        var monthNames = [
            "January", "February", "March", "April", "May", "June"
          , "July", "August", "September", "October", "November", "December"
        ];

        var month = monthNames[this.date.getMonth()]
        var day   = this.date.getDate();
        var year  = this.date.getFullYear();

        return month + " " + day + ", " + year;
    }

	var Member = function(name, portrait, position, major, desc) {
        this.name     = name;
        this.portrait = portrait;
        this.position = position;
        this.major    = major;
        this.desc     = desc;
    }

    var Event = function(header, date, desc, invite) {
        this.header = header;
        this.date   = date;
        this.desc   = desc;
        this.invite = invite;
    }
	var app = angular.module("inspLead", ['ngRoute']);

    app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'pages/blog.html',
            controller: 'BlogController'
        }).
        when('/posts/:postId', {
            templateUrl: 'pages/blog-post.html',
            controller: 'BlogDetailCtrl'
        }).
        when('/about', {
            templateUrl: 'pages/about.html',
        }).       
        when('/members', {
            templateUrl: 'pages/members.html',
            controller: 'RosterController'
        }).
        when('/contact', {
            templateUrl: 'pages/contact.html',
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);

    app.service('ParseJSONService', function($http) {
        this.getParsedJSON = function() {
            var promise = $http.get("http://jpdstan.github.io/insp-comm-lead-web/posts.json")
                .then(function (response) {
                    return response.data;
            });
            return promise;
        }
    });

    app.controller("BlogController", function($scope, ParseJSONService) {
        $scope.posts = [];
        ParseJSONService.getParsedJSON().then(function (data) {
            var parsedJSON = data;

            for (var i = 0; i < parsedJSON.posts.length; i++) {
                var post = parsedJSON.posts[i];
                $scope.posts.push(new Post(
                        post.header
                      , post.author
                      , new Date(post.date[0], post.date[1], post.date[2])
                      , post.text
                      , post.links
                      , post.index
                    )
                );
            }
        });
    });

    app.controller("BlogDetailCtrl", ['$scope', '$routeParams',function($scope, $routeParams) {
        $scope.post_id = $routeParams.postId;
    }]);

    app.directive("isoTime", function() {
        return {
            link: function (scope, element, attrs) {
                var time = attrs.myIsoTime;
                attrs.$set('timedate', time);
            }
        }
    });
})();