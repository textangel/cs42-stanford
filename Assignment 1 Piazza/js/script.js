(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    var searchBar = document.getElementById('search');
    var leftPanelInteractors = document.querySelector('#interactors');
    var newQuestionButton = leftPanelInteractors.querySelector('.btn');
    var leftPane = document.querySelector('#left-pane');

    // script elements that correspond to Handlebars templates
    var questionFormTemplate = document.getElementById('question-form-template');
    var leftPaneTemplate = document.getElementById('questions-template');
    var expandedQuestionTemplate = document.getElementById('expanded-question-template');

    // compiled Handlebars templates
    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        renderLeftPane: Handlebars.compile(leftPaneTemplate.innerHTML),
        renderExpandedQuestionTempate: Handlebars.compile(expandedQuestionTemplate.innerHTML)
    };

    // Functions called to initialize the page.
    var questions = getStoredQuestions();
    printToLeftPane(questions);
    displayNewQuestionPanel();


    /* Returns the questions stored in localStorage. */
    function getStoredQuestions() {
        if (!localStorage.questions) {
            // default to empty array
            localStorage.questions = JSON.stringify([]);
        }
        return JSON.parse(localStorage.questions);
    }

    /* Returns a copy of a question element in localstorage given its id. */
    function getQuestion(id){
        var questions = getStoredQuestions();
        for (var i = questions.length - 1; i >= 0; i--) {
            if (+questions[i].id == +id) {
                return questions[i];
            }
        }
        return NULL;
    }

    /* Store the given questions array in localStorage.
      Arguments:
      questions -- the questions array to store in localStorage
     */
    function storeQuestions(questions) {
        localStorage.questions = JSON.stringify(questions);
    }

    /* Displays the panel in which the user can submit a new question.
     This is the defualt panel that is loaded when the page is loaded, or 
     when the 'New Question Form' button is clicked.
    */
    function displayNewQuestionPanel(){
        rightPane.innerHTML = templates.renderQuestionForm(); 
        var rightForm = document.getElementById('question-form');
        var questionForm = rightPane.querySelector('[name="question"]');  
        var subjectForm = rightPane.querySelector('[name="subject"]');
        rightForm.addEventListener('submit', function(event){
            event.preventDefault();
            var questions = getStoredQuestions();
            if (subjectForm.value && questionForm.value){
                var newquestion = {"question": questionForm.value , "subject": subjectForm.value, "id": Math.random(), "responses" : []}//use math.random() for id. 
                questions.push(newquestion);
                displayNewQuestionPanel(); //re-renders the right panel on the event that the user submits a question.
            }
            storeQuestions(questions);
            printToLeftPane(questions);
        });
    }

    /* Prints an array of given questions to the left pane.
     */
    function printToLeftPane(questions){
        var questions_obj = {"questions": questions}; //giving a name to the object so handlebars knows what it is;
        leftPane.innerHTML = templates.renderLeftPane(questions_obj);
        var questions = leftPane.children;
    }

    /* When a question on the left pane is clicked, this function
        is called to display the question to the right pane and add appropriate event listeners to it.
     */
    function displayQuestionToRightPanel(question){
        rightPane.innerHTML = templates.renderExpandedQuestionTempate(question);     
        var responseForm = document.getElementById('response-form');   
        var nameForm = responseForm.querySelector('[name="name"]');
        var responseBox = responseForm.querySelector('[name="response"]');

        var submitButton = responseForm.querySelector('[value="Submit"]');
        submitButton.addEventListener('click', function(event){
            event.preventDefault();
            if(nameForm.value && responseBox.value){
                var newComment = {"name": nameForm.value , "response": responseBox.value}
                var questions = getStoredQuestions();
                questions.forEach(function (element) {
                    if (element.id === question.id){
                        element.responses.push(newComment);
                        question = element;
                    }
                });
                storeQuestions(questions);
                questions = getStoredQuestions();
                displayQuestionToRightPanel(question);
            }
        });
        resolveButtonAddEventListener(question);
    }

    /* When a question is being displayed on the right pane, this function adds an event listener to its
        "Resolve Button." When this button is clicked, the question is deleted from our database
        and the left pane is updated accordingly.
     */
    function resolveButtonAddEventListener(question){
        var resolveButton = rightPane.querySelector('[class="resolve btn"]');
        resolveButton.addEventListener('click', function(event){
            event.preventDefault();
            var questions = getStoredQuestions();
            for (var i = questions.length - 1; i >= 0; i--) {
                if (questions[i].id === question.id)
                    questions.splice(i, 1);
            };

            storeQuestions(questions);
            printToLeftPane(questions);
            displayNewQuestionPanel();
        });
    }

    //Event Listeners for elements that will only be added once,
    //because these elements are never be rerendered in our HTML.

    /*Displays the New Question Panel if the 'New Questions Button' is pressed.*/
    newQuestionButton.addEventListener('click', function(event){
        event.preventDefault();
        displayNewQuestionPanel();
    })

    /* Displays the appropriate question to the right pane when a question on the left pane
    is clicked. */
    leftPane.addEventListener('click', function (event){
        var target = event.target;
        while (target && target.className !== "list-question question-info"){
            target = target.parentNode;
        }
        if (target.className === "list-question question-info"){
            var id = target.id;
            var thisQuestion = getQuestion(id);
            displayQuestionToRightPanel(thisQuestion); //look for it in the handlebaras templates
        }
    });

    /* When there is any typing in the search bar, the left pane is updated to only contain
    elements whose questions or subjects contain the search key. */
    var prevSearchText = "";
    searchBar.addEventListener('keyup', function(event){
        var questions = getStoredQuestions();
        if (searchBar.value && searchBar.value !== prevSearchText){
            var searchKey = searchBar.value;
            var filteredQuestions = questions.filter(function (questionElement){
                return (questionElement.question.indexOf(searchKey) != -1 || 
                        questionElement.subject.indexOf(searchKey) != -1)
            });
            prevSearchText = searchBar.value;
            console.log("left pane updated!");
            printToLeftPane(filteredQuestions);
        } else if (!searchBar.value){
            printToLeftPane(questions);
        }
    })

})(this, this.document);
