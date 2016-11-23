// JavaScript source code
$(document).ready(function () {

  $.get('/data/reviews.json').done(useReturnData).fail(noDataLoaded);

  function noDataLoaded() {
    $("#reviews-widget").empty();
    $("#reviews-widget").append('<h1>No reviews found</h1>');
  }

  function useReturnData(reviews) {
    var ratingStats = countAverageRating(reviews);
    var averageRating = ratingStats.sum / ratingStats.ratingsLength;
    var roundAverageRating = Math.round(averageRating);
    $("#trust-score").append('<div class="score-main"><div class="star-score"><strong>' + roundAverageRating + '</strong><img src="/img/white_star.png" alt="star image"/></div></div>');
    $('.star-score').addClass(getStarScoreCssClass(roundAverageRating));

    $("#trust-score").append('<div class="score-summary"><span><strong>' + averageRating + '</strong> out of 5 stars</span><span><strong>' + ratingStats.ratingsLength + '</strong> reviews</span></div>');


    checkRatingsPagerLinks(reviews);
    displaySortedReviews(reviews);

  };

  function getStarScoreCssClass(averageRating) {
    switch (averageRating) {
      case 5: return 'five-star';
      case 4: return 'four-star';
      case 3: return 'three-star';
      case 2: return 'two-star';
      case 1: return 'one-star';
      default: return '';
    }
  }

  function countAverageRating(reviews) {
    var ratingsLength = 0;
    var sum = 0;

    for (var i = 0; i < reviews.length; i++) {
      var review = reviews[i];
      if (review.starRating) {
        sum += parseInt(review.starRating, 10);
        ratingsLength++;
      }
    }

    return { sum: sum, ratingsLength: ratingsLength };
  }

  function displaySortedReviews(reviews) {
    $("#ratings-pager").on("click", ".pager-link:not(.disabled)", function (e) {
      $("#reviews-container").empty();

      var currentReviewRate = $(this).data("rating");
      markActiveTab(currentReviewRate);


      displayReviewsByRating(reviews, currentReviewRate);

      return false;
    });

    markActiveTab("all");
    displayReviewsByRating(reviews, "all");

  }

  function checkRatingsPagerLinks(reviews) {

    var ratings = reviews.map(function (obj) { return obj.starRating; });
    ratings = ratings.filter(function (v, i) { return ratings.indexOf(v) == i; });
    ratings.push("all");

    var pagerLinks = $('.pager-link');

    for (var i = 0; i < pagerLinks.length; i++) {

      if (ratings.indexOf($(pagerLinks[i]).data("rating").toString()) == -1) {
        $(pagerLinks[i]).addClass("disabled");
      }
    };
  }
  function markActiveTab(rating) {
    $(".pager-link").removeClass("active");
    $(".pager-link[data-rating='" + rating + "']").toggleClass("active");
  }
  function displayReviewsByRating(reviews, rating) {

    if (rating !== "all") {
      reviews = reviews.filter(function (review) { return review.starRating == rating; });
    };
    var container = $("#reviews-container");
    reviews.forEach(function (review) {
      var reviewView = getReviewView(review);
      container.append(reviewView);
    })
  }

  function getReviewView(review) {
    var result = $('<article class="review"></article>');
    var header = $('<header></header>').append($('<h3></h3>').text(review.reviewTitle));
    var content = $('<p></p>').addClass("description").text(review.reviewBody);
    var footer = $('<footer></footer>').addClass("author").append($("<em></em>").text(review.firstName)).append(' gave ');
    var rating = $('<span></span>').text(review.starRating + ' \u2605').addClass(getStarScoreCssClass(parseInt(review.starRating, 10)));
    footer.append(rating);

    return result.append(header, content, footer);
  }
});
