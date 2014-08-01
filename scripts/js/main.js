(function () {
	var Post = function(header, author, date, text, imgLinks, index) {
        this.header = header;
        this.author = author;
        this.date   = date;
        this.text   = text;
        this.links  = imgLinks;
        this.index  = index;
	};
    var Event = function(header, date, desc, imgLinks, invite, address, active) {
        this.header   = header;
        this.date     = date;
        this.desc     = desc;
        this.links    = imgLinks;
        this.invite   = invite;
        this.address  = address;
        this.active   = active;
    };
	var Member = function(name, portrait, position, major, desc) {
        this.name     = name;
        this.portrait = portrait;
        this.position = position;
        this.major    = major;
        this.desc     = desc;
    };
    Post.prototype.getDatePlain = Event.prototype.getDatePlain =function(date){
        var monthNames = [
            "January", "February", "March", "April", "May", "June"
          , "July", "August", "September", "October", "November", "December"
        ];

        var month = monthNames[date.getMonth()-1]
        var day   = date.getDate();
        var year  = date.getFullYear();

        return month + " " + day + ", " + year;
    };

    Event.prototype.formatAddress = function(address){
        var formattedAddress = "";
        address = address.split(" ");
        for (var i = 0; i < address.length; i++){
            if (i == address.length - 1){
                formattedAddress += address[i];
                break;
            }
            formattedAddress += address[i] += "+";
        }
        return formattedAddress;
    }

    var app = angular.module("inspLead", ['ngRoute']);

    app.config(['$routeProvider', function($routeProvider){
    $routeProvider.
        when('/', {
            templateUrl: 'pages/blog.html'
        }).
        when('/posts/:postId', {
            templateUrl: 'pages/blog-post.html',
            controller: 'BlogDetailCtrl'
        }).
        when('/events', {
            templateUrl: 'pages/events.html'
        }).
        when('/about', {
            templateUrl: 'pages/about.html'
        }).       
        when('/members', {
            templateUrl: 'pages/members.html'
        }).
        when('/contact', {
            templateUrl: 'pages/contact.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);

    app.service('ParseJSONService', function($http) {
        this.getParsedJSON = function() {
            var promise = $http.get("posts.json")
            // http://jpdstan.github.io/insp-comm-lead-web/posts.json
                .then(function (response) {
                    return response.data;
            });
            return promise;
        }
    });

    app.controller("BlogController", function($scope, ParseJSONService) {
        $scope.posts = [];
        $scope.events = [];
        $scope.members = [];
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
            for (var i = 0; i < parsedJSON.events.length; i++) {
                var oneEvent = parsedJSON.events[i]; // would have named the variable "event" if it weren't a reserved word
                $scope.events.push(new Event(
                        oneEvent.header
                      , new Date(oneEvent.date[0], oneEvent.date[1], oneEvent.date[2])
                      , oneEvent.desc
                      , oneEvent.links
                      , oneEvent.invite
                      , oneEvent.address
                      , oneEvent.active
                    )
                );
            }
            for (var i = 0; i < parsedJSON.members.length; i++) {
                var member = parsedJSON.members[i];
                $scope.members.push(new Member(
                        member.name
                      , member.portrait
                      , member.position
                      , member.major
                      , member.desc
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