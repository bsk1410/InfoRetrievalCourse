app = angular.module('myApp',[]);
	app.controller('myCtrl',function($scope, $http){
		//$scope.searchBox = "Testing for value";
		//var queryURL = "http://localhost:8983/solr/tweet_store/select?q=";
		//queryURL += "clinton";
		queryURL = "http://localhost:5000/index";
		$scope.getResults=function(){
			$http({
				method: 'POST',
				url: queryURL,
				data:{
					info: $scope.searchBox
				}
			})

		}
	})