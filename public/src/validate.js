$(document).ready(function(){

  //validate login form
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

});