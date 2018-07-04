
$.getJSON("/", function(data) {
  console.log("testing get results");
  console.log(data);
  // var hbsObject = {
  //   art: data
  // };
  // res.render("index", hbsObject);
});


$(document).on("click", "#scrape", function(event) {
  event.preventDefault();
  // $("#articles").empty();
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data) {
    // initPage();
    window.location.reload();
  })
});

$(document).on("click", "#clear", function(event) {
  event.preventDefault();
  $("#articleContainer").empty();
});

// $(document).on("click", "#saved", function(event) {
//   event.preventDefault();
//   $.ajax({
//     method: "GET",
//     url: "/saved"
//   }).then(function(data) {
//     console.log(data);
//     window.location.reload();
//   })
// })

$(document).on("click", "#saveArtBtn", function() {
  var thisId = $(this).attr("data-id");
  $(this).parents(".card").remove();
  $.ajax({
      method: "POST",
      url: "save/" + thisId, 
      data: {
        saved: true
      }
  }).then(function(data) {
    // initPage();
    window.location.reload();
  })
});

$(document).on("click", "#saveNote", function() {
  var thisId = $(this).attr("data-id");
  console.log(this);
  console.log({thisId});
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $("#newNoteBody" + thisId).val()
    }
  }).then(function(data) {
    console.log({data});
    // $("#newNote-text").val("");
    // window.location.reload();
  });
});

$(document).on("click", "#addNote", function(event) {
  event.preventDefault();
  var thisId = $(this).attr("data-id");
  console.log(this);
  console.log({thisId});
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);
  })
})