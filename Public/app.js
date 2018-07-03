function getResults() {
  $.getJSON("/", function(data) {
    console.log(data);
    var hbsObject = {
      art: data
    };
    res.render("index", hbsObject);
  });
}

getResults();

$("#scrape").on("click", function() {
  $("#articles").empty();
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data) {
    console.log("-------------------", data);
    getResults();
  })
});