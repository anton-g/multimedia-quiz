$(function() {
  /*
  * TEMP - TODO: REMOVE ME
  <div class="col-xs-12">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h2 class="panel-title question" id="1">Question?</h2>
      </div>
      <div class="panel-body">
        <ul class="nav nav-pills nav-justified answers">
          <li role="presentation" class="answer"><a href="#">Dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </a></li>
          <li role="presentation" class="answer"><a href="#">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</a></li>
          <li role="presentation" class="answer"><a href="#">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</a></li>
          <li role="presentation" class="answer"><a href="#">Ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</a></li>
        </ul>
      </div>
    </div>
  </div>
  */

  /*
  * SETUP
  */
  var questions = new Array();

  fetchQuestions(function() {
    showQuestions();

    $('.answer').click(function(e) {
      e.preventDefault();

      var parent = $(this).parent();

      parent.children().each(function(a) {
        $(this).removeClass('active');
      });

      $(this).addClass('active');

      didSelectAnswer($(this).closest('.question').attr('data-questionID'), $(this).attr('data-answerID'));
    });
  });

  $('#answerBtn').click(function(e) {
    e.preventDefault();

    correctAnswers();
  });

  function showQuestions() {
    questions.forEach(function(q) {
      showQuestion(q);
    });
  }

  //TODO: Add support for images and videos in XML
  function showQuestion(question) {
    var htmlQuestion = '<!-- Question START --><div class="row question" data-questionID="' + question.number + '"><div class="col-xs-12"><div class="panel panel-default"><div class="panel-heading"><h2 class="panel-title">' + question.question + '</h2></div><div class="panel-body"><ul class="nav nav-pills nav-justified answers">';
    $(question.answers).each(function(index) {
      htmlQuestion = htmlQuestion + '<li role="presentation" class="answer" data-answerID="' + (index + 1) + '"><a href="#">' + question.answers[index] + '</a></li>';
    });

    htmlQuestion = htmlQuestion + '</ul></div></div></div></div><!-- Question END -->';

    $('#questions').append(htmlQuestion);
  }

  /*
  * BACKEND
  */

  function fetchQuestions(complete) {
    $.get('questions.xml', function(data) {
      $(data).find('question').each(function() {
        questions.push(createQuestionWith($(this)));
      });

      complete();
    });
  }

  function createQuestionWith(data) {
    var question = new Object();

    question.number = data.attr('id');
    question.question = data.attr('text');
    var answerData = $(data).find('answer');

    var answers = new Array();
    $(answerData).each(function(index) {
      if ($(this).attr('correct') == 'YES') {
        question.correctAnswer = index + 1;
      }

      answers.push($(this).text());
    });
    question.answers = answers;

    return question;
  }

  function didSelectAnswer(questionID, answerID) {
    var question = questionFromID(questionID);
    question.userAnswer = answerID;
  }

  function questionFromID(id) {
    var q = new Object();
    questions.forEach(function(question) {
      if (question.number == id) {
        q = question;
      }
    });
    return q;
  }
});
