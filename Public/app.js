function getResults() {
  $.getJSON("/articles", function(data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(
        `<p>${data[i].title} <br> ${data[i].link} <br> ${data[i].summary} </p>`
      );
    }
  });
}

// getResults();

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