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
          required: "Please fill in.",
          email: "Must be an email address."
        },
        password: {
          required: "Don't forget your password."
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
          required: "Please fill this in."
        },
        lname: {
          required: "Please fill this in."
        },
        email: {
          required: "Please fill this in.",
          email: "This needs to be an email."
        },
        password: {
          required: "Please fill this in."
        },
        confirm: {
          required: "Please fill this in.",
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
          required: "Please fill this in."
        },
        category: {
          required: "Please fill this in."
        },
        story: {
          required: "Please fill this in.",

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
        required: "Please fill this in.",
        wordsrange: "Please give a little more feedback to help your fellow writers."
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
    word_limit = [100, 10000]
  }

  return true
}, "Category couldn't set range");

// Infinity