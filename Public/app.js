
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
  $.ajax({
    method: "DELETE",
    url: "/clearall"
  }).then(function(data) {
    console.log("Unsaved articles cleared from db");
    $("#articleContainer").empty();
    window.location.reload();
  });
});

$(document).on("click", "#saveArtBtn", function() {
  var thisId = $(this).attr("data-id");
  $(this).parents(".card").remove();
  $.ajax({
    method: "POST",
    url: "saveArticle/" + thisId, 
    // data: {
    //   saved: true
    // }
  }).then(function(data) {
    console.log(data);
    window.location.reload();
  })
});

$(document).on("click", "#deleteSavedArt", function() {
  var thisId = $(this).attr("data-id");
  console.log({thisId});
  $.ajax({
    method: "POST",
    url: "/unsaveArticle/" + thisId, 
    // data: {
    //   saved: false
    // }
  }).then(function(data) {
    console.log(data);
    window.location.reload();
  });
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
    $("#newNoteBody" + thisId).val("");
    window.location.reload();
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
  });
});

$(document).on("click", "#deleteNote", function(event) {
  event.preventDefault();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/deleteNote/" + thisId
  }).then(function(data) {
    console.log(data);
    window.location.reload();
  });
});