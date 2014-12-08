"use strict";

var capstonesUrl = 'https://api.parse.com/1/classes/capstones';


angular.module('CapstonesList', [])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'LPLyK3Gy2gc4VHUW143qhkZXSblTUC1jzRdwC7AY';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'Tyu8ovkDEuLhi6TvX8gBRbJQazvXJSRRFigEu9gl';
    })
    .controller('CapstonesController', function($scope, $http) {
        $scope.refreshCapstones = function() {
            //refreshes the capstones on the index page
            $http.get(capstonesUrl)
                .success(function(data) {
                    $scope.capstones = data.results;
                });
        };
        $scope.refreshCapstones();

        //adds capstone feed to parse when form is submitted
        $scope.addCapstones = function() {
            $scope.inserting = true;
            $http.post(capstonesUrl, $scope.newCapstone)
                .success(function(responseData) {
                    $scope.newCapstone.objectId = responseData.objectId;
                    $scope.capstones.push($scope.newCapstone);
                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };

        $scope.submitForm = function(isValid) {
            // check to make sure the form is completely valid
            $scope.submitted = true;
            if (isValid) {
                $scope.addCapstones();
                alert('Your entry has been received!');
                window.location = 'index.html';
                $scope.submitted = false;
            }
        };

        //takes user to home page if they want to cancel the form
        $scope.cancel = function($location) {
            if (window.confirm("Do you really want to leave?")) {
                window.location = 'index.html';
            }
        };

        $scope.year="";
        $scope.program="";
        $scope.category = "";
        
        $scope.refreshCapstones();

        //Does the filtering on the home page for capstones to be displayed
        $scope.filter = function() {
            $http.get(capstonesUrl)
                .success(function(data) {
                
                    $scope.capstones = data.results.filter(function(capstone) {
                        console.log(data.results);

                        if ($scope.year == "yearAll" || $scope.year == "") {
                            capstone.year = year.value;
                        }

                        if ($scope.category == "categoryAll" || $scope.category == "") {
                            capstone.category = category.value;
                        }

                        if ($scope.program == "sortedAll" || $scope.program == "") {
                            capstone.program = program.value;
                        }

                        return (capstone.year == year.value && capstone.category == category.value 
                            && capstone.program == program.value);
                    });

                });

        };

        //increments the likes on the home page
        $scope.incrementLikes = function(capstone, amount) {
            $http.put(capstonesUrl + '/' + capstone.objectId, {
                likes: {
                    __op: 'Increment',
                    amount: amount
                }
            })
            .success(function(responseData) {
                capstone.likes = responseData.likes;
            })
        };
    })

    //second controller just for project.html
    .controller('ProjectController', function($scope, $http) {
        //Gets the capstone that was clicked on on the home page and displays its info
        $scope.getCapstone = function() {

            var newUrl = window.location.pathname+window.location.search;
            var urlArray = newUrl.split('=');
            var objectId = urlArray[1];

            $http.get(capstonesUrl)
                .success(function(data) {
                    $scope.capstones = data.results.filter(function(project) {
                        console.log("are you getting here");
                        return (project.objectId == objectId);
                    });
                });
        };

        $scope.getCapstone();

        //allows user to toggle between pictures on the project.html page
        $scope.changePic = function(imgSrc) {
            document.getElementById("img-main").src = imgSrc;
        };

    });

