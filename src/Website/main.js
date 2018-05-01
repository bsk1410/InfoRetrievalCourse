app = angular.module('myApp',[]);
	app.controller('myCtrl',function($scope, $http){
		//$scope.searchBox = "Hillary Clinton";
		var queryURL = "http://localhost:8983/solr/tweet_store/select?q=";
		//queryURL += $scope.searchBox;
		var isUserId = false;
		var screenName = false;
		//weights
		var wTf = 0.7;
		var wCf = 0.3;
		var wId0 = 0.7;
		var wId1 = 0.3;
		var wIdn = 2;

		var entityMap = {0: ['alicia machado'],
 1: ['american flag'],
 2: ['barack obama', 'president obama', 'pres obama', 'potus'],
 3: ['ben carson'],
 4: ['bernie sanders', 'sen sanders', 'senator sanders'],
 5: ['bill clinton', 'president clinton', 'pres clinton'],
 6: ['black lives matter', 'blacklivesmatter'],
 7: ['blue lives matter', 'bluelivesmatter'],
 8: ['build the wall', 'buildthewall'],
 9: ['chris christie', 'governor christie', 'gov christie'],
 10: ['cleveland browns', 'clevelandbrowns'],
 11: ['climate change', 'global warming', 'climatechange', 'globalwarming'],
 12: ['clinton foundation', 'clintonfoundation'],
 13: ['convention speech'],
 14: ['cory booker', 'senator booker', 'sen booker'],
 15: ['crooked hillary', 'crookedhillary'],
 16: ['debate poll', 'debatepoll'],
 17: ['wasserman-schultz', 'wasserman schultz', 'dws'],
 18: ['democratic convention', 'democratic national convention'],
 19: ['democratic national committee', 'dnc'],
 20: ['democratic party', 'dems', 'democrats'],
 21: ['donald j trump', 'donald trump'],
 22: ['donna brazile'],
 23: ['drinking game'],
 24: ['elizabeth warren', 'senator warren', 'sen warren'],
 25: ['fact check'],
 26: ['fox news'],
 27: ['glass ceiling', 'glassceiling'],
 28: ['go high', 'gohigh'],
 29: ['republican convention', 'republican national convention'],
 30: ['gun violence', 'gunviolence'],
 31: ['hillary clinton',
  'secretray clinton',
  'sec clinton',
  'senator clinton',
  'sen clinton',
  'hrc'],
 32: ['ivanka trump'],
 33: ['jill stein'],
 34: ['joe biden', 'uncle joe', 'vice president', 'vpotus'],
 35: ['katy perry'],
 36: ['lady gaga'],
 37: ['laura ingraham'],
 38: ['lester holt'],
 39: ['make america great again', 'making america great again', 'maga'],
 40: ['melania trump'],
 41: ['michael bloomberg', 'mayor bloomberg'],
 42: ['michelle obama', 'first lady', 'flotus'],
 43: ['middle class'],
 44: ['mike pence', 'governor pence', 'gov pence'],
 45: ['miss piggy', 'misspiggy'],
 46: ['national security'],
 47: ['new york', 'ny', 'nyc', 'big apple'],
 48: ['open carry'],
 49: ['paul ryan'],
 50: ['peter thiel'],
 51: ['reince priebus'],
 52: ['release the tax returns'],
 53: ['republican national committee', 'rnc'],
 54: ['republican national party', 'republican party', 'gop', 'republicans'],
 55: ['rigged system', 'riggedsystem'],
 56: ['roll call'],
 57: ['ronald reagan'],
 58: ['rudy giuliani', 'rudy', 'mayor giuliani', 'giuliani'],
 59: ['sarah silverman'],
 60: ['scott baio'],
 61: ['social media'],
 62: ['south dakota', 'sd'],
 63: ['stephen colbert'],
 64: ['steve king', 'rep king'],
 65: ['stronger together', 'strongertogether'],
 66: ['susan sarandon'],
 67: ['team deplorables', 'teamdeplorables'],
 68: ['ted cruz', 'senator cruz', 'sen cruz'],
 69: ['tim kaine', 'senator kaine', 'sen kaine'],
 70: ['united states', 'usa'],
 71: ['wall street'],
 72: ['white house'],
 73: ['william barber']};

		var replaceMap = {0: ['"alicia machado" aliciamachado machado'],
 1: ['"american flag" "american flags" americanflag flag'],
 2: ['"barack obama" barackobama "president obama" presidentobama "pres obama" presobama barack obama potus'],
 3: ['"ben carson" bencarson carson'],
 4: ['"bernie sanders" berniesanders sanders sensanders senatorsanders'],
 5: ['"bill clinton" billclinton "president clinton" presidentclinton "pres clinton" presclinton'],
 6: ['"black lives matter" blacklivesmatter'],
 7: ['"blue lives matter" bluelivesmatter'],
 8: ['"build the wall" buildthewall "the wall"'],
 9: ['"chris christie" chrischristie "governor christie" governorchristie "gov christie" govchristie christie'],
 10: ['"cleveland browns" clevelandbrowns browns'],
 11: ['"climate change" climatechange "global warming" globalwarming'],
 12: ['"clinton foundation" clintonfoundation'],
 13: ['"convention speech", speech'],
 14: ['"cory booker" corybooker booker "senator booker" senatorbooker "sen booker" senbooker'],
 15: ['"crooked hillary" crookedhillary'],
 16: ['"debate poll" debatepoll'],
 17: ['"wasserman-schultz" "wasserman schultz" wassermanschultz debbiewassermanschultz dws '],
 18: ['"democratic convention" "democratic national convention" democraticconvention convention'],
 19: ['"democratic national committee" dnc'],
 20: ['"democratic party" democraticparty dems democrats'],
 21: ['"donald j trump" "donald trump" donaldjtrump donaldtrump trump'],
 22: ['donnabrazile\t"donna brazile"'],
 23: ['"drinking game" drinkinggame'],
 24: ['"elizabeth warren" elizabethwarren "senator warren" senatorwarren "sen warren" senwarren warren'],
 25: ['"fact check" factcheck'],
 26: ['"fox news" foxnews'],
 27: ['"glass ceiling" glassceiling'],
 28: ['"go high" gohigh'],
 29: ['"gop convention" "republican convention" "republican national convention" gopconvention republicanconvention convention'],
 30: ['"gun violence" gunviolence'],
 31: ['"hillary clinton" "secretray clinton" "sec clinton" "senator clinton" "sen clinton" hrc hillaryclinton secretaryclinton secclinton senatorclinton senclinton hillary clinton'],
 32: ['"ivanka trump" ivankatrump~1 ivanka~1'],
 33: ['"jill stein" jillstein stein'],
 34: ['"joe biden" joebiden "uncle joe" unclejoe "vice president" vpotus biden'],
 35: ['"katy perry" kattyperry'],
 36: ['"lady gaga" ladygaga'],
 37: ['"laura ingraham" lauraingraham~1 ingraham~1'],
 38: ['"lester holt" lesterholt lester holt'],
 39: ['"make america great again" "making america great again" maga'],
 40: ['"melania trump" melaniatrump melania'],
 41: ['"michael bloomberg" "mayor bloomberg" bloomberg'],
 42: ['"michelle obama" michelleobama "first lady" flotus michelle'],
 43: ['"middle class"'],
 44: ['"mike pence" mikepence "governor pence" governorpence "gov pence" govpence pence'],
 45: ['"miss piggy" misspiggy'],
 46: ['"national security" nationalsecurity'],
 47: ['"new york" newyork ny nyc "big apple" bigapple'],
 48: ['"open carry" opencarry'],
 49: ['"paul ryan" paulryan ryan'],
 50: ['"peter thiel" peterthiel thiel'],
 51: ['"reince priebus" reincepriebus~1 priebus~1'],
 52: ['"release the tax returns" "tax returns"'],
 53: ['"republican national committee" rnc'],
 54: ['"republican national party" "republican party" republicanparty gop republicans'],
 55: ['"rigged system" riggedsystem'],
 56: ['"roll call" rollcall'],
 57: ['"ronald reagan" ronaldreagan reagan'],
 58: ['"rudy giuliani" rudygiuliani~1 rudy giuliani~1 "mayor giuliani" mayorgiuliani~1'],
 59: ['"sarah silverman" sarahsilverman silverman'],
 60: ['"scott baio" scottbaio baio'],
 61: ['"social media" socialmedia'],
 62: ['"south dakota" sd'],
 63: ['"stephen colbert" stephencolbert colbert'],
 64: ['"steve king" steveking "rep king" repking king'],
 65: ['"stronger together" strongertogether'],
 66: ['"susan sarandon" susansarandon~1 sarandon~1'],
 67: ['"team deplorables" teamdeplorables'],
 68: ['"ted cruz" "senator cruz" "sen cruz" tedcruz senatorcruz sencruz ted cruz'],
 69: ['"tim kaine" timkaine "senator kaine" senatorkaine "sen kaine" senkaine tim kaine'],
 70: ['"united states" usa'],
 71: ['"wall street" wallstreet'],
 72: ['"white house" whitehouse'],
 73: ['"william barber" williambarber~1 barber~']};

 //console.log(replaceMap[0][0]);

		function replaceEntities(q){
			for(i=0;i<entityMap.length;i++){
				for(j=0;j<entityMap[i].length;j++){
					if (entityMap[i][j].includes(q.toLowerCase())){
						//console.log(entityMap[i][j]);
						//console.log(q);
						q = q.replace(entityMap[i][j],replaceMap[i]);
						break;
					}
				}
			}
			return q;
		}

		isSpanish = 0;
		function applyBoosts(q){
			engBoost = ('qf=text_eng^'+wTf+' ')
			console.log(engBoost);
			//espBoost = ('qf=text_esp^'+wTf+' ')*(isSpanish);
			return '{' +engBoost+'qf=_text_^'+wCf+'}'+q
		}

		function systemCode(q){
			q=queryURL+q.replace(' ','%20').replace('"','%22')+'&wt=json';
			return q
		}	
		//console.log($scope.searchBox);
		//var q = replaceEntities($scope.searchBox);
		//console.log(q);
		//qSys = systemCode(q);
		//console.log(q);
		$scope.getResults=function(){
			queryURL = "http://localhost:8983/solr/tweet_store/select?q=";
			queryURL += $scope.searchBox;
			var q = replaceEntities($scope.searchBox);
			//q = applyBoosts(q);
			qSys = systemCode(q);

			console.log(qSys);
			$http.get(qSys).then(function(response){
				$scope.results = response.data.response.docs;
			});

		}
	})