word_limit = [];


$(document).ready(function(){

  $("#login-form").validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
        }
      },
      messages: {
        email: {
          required: "<div class='notice'>Please fill in.</div>",
          email: "<div class='error'>Must be an email address.</div>"
        },
        password: {
          required: "<div class='error'>Don't forget your password.</div>"
        }
      }
    });

  //validate signup form
  $('#signup-form').validate({
      rules: {
        fname: {
          required: true
        },
        lname: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
        },
        confirm: {
          required: true,
          // equalTo: "password"
        }
      },
      messages: {
        fname: {
          required: "<div class='error'>Please fill this in.</div>"
        },
        lname: {
          required: "<div class='error'>Please fill this in.</div>"
        },
        email: {
          required: "<div class='error'>Please fill this in.</div>",
          email: "<div class='error'>This needs to be an email.</div>"
        },
        password: {
          required: "<div class='error'>Please fill this in.</div>"
        },
        confirm: {
          required: "<div class='error'>Please fill this in.</div>",
          // equalTo: "Make sure your passwords match."
        }
      }
    });

  //validate the submit-story form
  $('#story-form').validate({
      rules: {
        title: {
          required: true
        },
        category: {
          required: true,
          setrange: true
        },
        story: {
          required: true,
          wordsrange: true
        }
      },
      messages: {
        title: {
          required: "<div class='error'>Please fill this in.</div>"
        },
        category: {
          required: "<div class='error'>Please fill this in.</div>"
        },
        story: {
          required: "<div class='error'>Please fill this in.</div>",

        }
      }
    });

  //validate the submit-story form
  $('#review-post').validate({
    rules: {
      content: {
        required: true,
        setrange: true,
        wordsrange: true
      }
    },
    messages: {
      content: {
        required: "<div class='error'>Please fill this in.</div>",
        wordsrange: "<div class='error'>Please give a little more feedback to help your fellow writers.</div>"
      }
    }
  });
});


//gets the word count
function wordCount(str) {
  return str.match(/(\w+)/g).length;
}


//Adds the rule to check the word count is within range
$.validator.addMethod("wordsrange", function(value, element) {
  let wc = wordCount(value);
  console.log("Limit: " + word_limit +" WC: "+ wc);
  if (wc > word_limit[0] && wc <= word_limit[1]) {
    return true
  } else {
    return false
  }

}, "Category does not match word count.");

//Sets the range for word count
$.validator.addMethod("setrange", function(value, element) {

  if (value == "tinyfict") {
    word_limit = [0, 1200]
  }

  else if (value == "shorfict") {
    word_limit = [1200, 3200]
  }

  else if (value == "longfict") {
    word_limit = [3200, 6200]
  }

  else if (value == "shornfic") {
    word_limit = [0, 2000]
  }

  else if (value == "longnfic") {
    word_limit = [2000, 6000]
  }

  else if (value == "shorpoem") {
    word_limit = [0, 1500]
  }

  else if (value == "epicpoem") {
    word_limit = [1500, 5000]
  }

  else {
    word_limit = [100, 100000]
  }

  return true
}, "<div class='error'>Category couldn't set range</div>");