(function () {

    var app = angular.module("githubViewer", []);

    var MainController = function ($scope, github, $interval, $anchorScroll, $location) {

        var onUserComplete = function (data) {
            $scope.user = data;
            github.getRepos($scope.user).then(onRepos, onError);
        }
        var onRepos = function (data) {
            $scope.repos = data;
            $location.hash("userDetails");
            $anchorScroll();
        }

        var onError = function (reason) {
            $scope.error = "Could not fetch the data";
        }

        $scope.search = function (username) {

            github.getUser(username).then(onUserComplete, onError);

            if (countdownInterval) {
                $interval.cancel(countdownInterval);
                $scope.countdown = null;
            }

        }

        var countdownInterval = null;
        var decrementCountdown = function () {
            $scope.countdown -= 1;
            if ($scope.countdown < 1) {
                $scope.search($scope.username);
            }
        }

        var startCountdown = function () {
            countdownInterval = $interval(decrementCountdown, 1000, $scope.countdown);
        }

        $scope.username = "angular";
        $scope.repoSortOrder = "-stargazers_count";
        $scope.message = "Github Viewer";
        $scope.countdown = 5;
        startCountdown();

    }

    app.controller("MainController", ["$scope", "github", "$interval", "$anchorScroll", "$location", MainController]);
}());