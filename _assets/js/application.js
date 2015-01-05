(function (angular) {

var wfd = angular.module('wfd', ['ngMaterial']);

wfd.controller('wfd-app', function ($scope, $http, $mdSidenav) {
  $scope.selectedDay = 'Monday';
  $scope.days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  var planId = document.location.pathname.slice(1);
  // Empty plan ID. Send user back to start page
  if (!planId) {
    document.location.pathname = "/";
  }

  // Load Meal Plan
  $http.get('/plans/' + planId).success(function (plan) {
    $scope.plan = plan;
  });

  $scope.meals = [
    'Breakfast',
    'Lunch',
    'Dinner',
  ];

  $scope.mealsState = {
    'Breakfast' : true,
    'Lunch'     : true,
    'Dinner'    : true
  };

  $scope.openOptions = function ($event) {
    $mdSidenav('optionswindow').toggle();
    $event.preventDefault();
  };

  $scope.showMeal = function (mealName) {
    return $scope.mealsState[mealName];
  };
});

wfd.controller('options-controller', function ($scope, $mdSidenav) {
  $scope.close = function () {
    $mdSidenav('optionswindow').close();
  };

  var handleMealState = function (mealName) {
    return function (value) {
      if (angular.isDefined(value)) {
        $scope.mealsState[mealName] = value;
      }
      return $scope.mealsState[mealName];
    };
  };

  $scope.showBreakfast = handleMealState('Breakfast');
  $scope.showLunch     = handleMealState('Lunch');
  $scope.showDinner    = handleMealState('Dinner');
});

wfd.controller('meal-controller', function ($scope) {
  var makeAccessor = function (path) {
    return function (value) {
      if ($scope.plan) {
        if (angular.isDefined(value)) {
          $scope.plan[$scope.day][$scope.meal][path] = value;
        }
        return $scope.plan[$scope.day][$scope.meal][path];
      }
      
      return '';
    };
  };

  $scope.mealName = makeAccessor('name');
  $scope.mealUrl = makeAccessor('url');
  $scope.mealIngredients = function (value) {
    if ($scope.plan) {
      if (angular.isDefined(value)) {
        $scope.plan[$scope.day][$scope.meal].ingredients = value
          // Break input into individual items by line breaks or commas
          .split(/,|\n|\r\n/)
          // Clean up any extra whitespace
          .map(function (ingredient) {
            return ingredient.trim();
          });
      }

      return $scope.plan[$scope.day][$scope.meal].ingredients.join('\n');
    }

    return '';
  };

});

}(window.angular));
