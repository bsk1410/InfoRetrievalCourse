app = angular.module('myApp',['ngSanitize']);
	app.controller('myCtrl',function($scope, $http){
		$scope.lang ='English';
		var isSpanish = 0;
		var usr = 'no';
		var hashtag='';
		//$scope.searchBox = "Hillary Clinton";
		$scope.names = ['RNCinCLE','ElectionDay','Debates2016','GOPConvention',
		'DebateNight','ElectionNight','MAGA','TrumpPence16','ImWithHer','tcot',
		'ccot','NeverTrump','AmericaFirst','Decision2016','TrumpTrain',
		'MannequinChallenge','NBC4DC','MakeAmericaSafeAgain','NeverHillary',
		'FamousMelaniaTrumpQuotes','BetterThanThis','CrookedHillary','TrumpWon',
		'LockHerUp','UniteBlue','ImWithYou','RedNationRising','BlackLivesMatter',
		'CruzCrew','iVoted','byetrump','StrongerTogether','ElectionFinalThoughts',
		'DumpTrump','BlueLivesMatter','HillaryForPrison','Bikers4Trump',
		'DrainTheSwamp','MakeAmericaOneAgain','LyinTed','DirtyDonald','DNCinPHL',
		'VoteBlue','ImVotingBecause','KellyFile','MakeAmericaFirstAgain',
		'VoteYourConscience','WallOffTrump','OccupyTheDebates','DemsInPhilly'];
		var queryURL = "http://localhost:8983/solr/tweet_store/select?q=";

		$scope.getResults=function(){
			queryURL = "http://127.0.0.1:5000/";
			queryURL += ($scope.searchBox).replace(' ','%20');
			if ($scope.lang==='Spanish'){
					isSpanish = 1;
				}else{
					isSpanish = 0;
				}
			if ($scope.username){
				usr = $scope.username;
			} else{
				usr = 'no';
			}
			if ($scope.selectedName){
				//queryURL+='%20'+$scope.selectedName;
				hashtag = '%20'+$scope.selectedName;
			}
			queryURL+=hashtag+'_'+isSpanish+'_'+usr;
			console.log(queryURL);
			
			$http.get(queryURL).then(function(response){
				$scope.results = response.data.docs;
			});

		}
	})