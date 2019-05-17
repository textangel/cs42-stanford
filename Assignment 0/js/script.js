(function(window, document, undefined) {

  /* Sets a random integer quantity in range [1, 20] for each flavor. */
  function setQuantities() {
    var icecreams = document.getElementsByClassName("meta");
    for (var i = icecreams.length - 1; i >= 0; i--) {
      var span = document.createElement("span");
      span.setAttribute("class","quantity"); //sets the attribute class to quantity. adds "class= "wuantity"
      var num = Math.floor( Math.random() * 19 + 1 );
      span.innerHTML = num ;
      icecreams[i].insertBefore(span,icecreams[i].firstChild); 
      // you have to specify the container (in this case, icecreams[1]
        //the first argument is what youre inserting
        //the second argument is before where you will insert it.
        //you do repeat icreams[i] in the cuntion call, but you have to; you ahve to delare your conainer
    };

    

  }

  /* Extracts and returns an array of flavor objects based on data in the DOM. Each
   * flavor object should contain five properties:
   *
   * element: the HTMLElement that corresponds to the .flavor div in the DOM
   * name: the name of the flavor
   * description: the description of the flavor
   * price: how much the flavor costs
   * quantity: how many cups of the flavor are available
   */
  function extractFlavors() {
    var flavors = document.getElementsByClassName("flavor");
    var objects = [];
    for (var i = 0; i <= flavors.length - 1; i++) {
      var flavorObject = {}
      var descriptionTag = flavors[i].getElementsByClassName("description")[0];

      flavorObject.element = flavors[i];
      flavorObject.name = descriptionTag.children[0].textContent;
      flavorObject.description = descriptionTag.children[1].textContent;

      var priceTag = flavors[i].getElementsByClassName("price")[0];
      var priceasstring = priceTag.textContent.substring(1);
      flavorObject.price = parseFloat(priceasstring); //parsefloat is the same as +before the string
      
      var metaTag = flavors[i].getElementsByClassName("meta")[0];
      flavorObject.quantity = +metaTag.children[0].textContent;
      objects.push(flavorObject);
    };
    return objects;
  }


  /* Calculates and returns the average price of the given set of flavors. The
   * average should be rounded to two decimal places. */
  function calculateAveragePrice(flavors) {
    var sum = 0;
    flavors.forEach(function (element) {
      sum += element.price;
    })

    var average = (sum / flavors.length).toFixed(2);
    return average;

  }

  /* Finds flavors that have prices below the given threshold. Returns an array
   * of strings, each of the form "[flavor] costs $[price]". There should be
   * one string for each cheap flavor. */
  function findCheapFlavors(flavors, threshold) {

    var cheapflavors = flavors.filter(function (flavor, index){
      return (flavor.price <= threshold);
    })

    var cheapFlavorToString = cheapflavors.map(function (flavor){
      return (flavor.name + ' costs $' + flavor.price);
    })
    return cheapFlavorToString;
  }

  /* Populates the select dropdown with options. There should be one option tag
   * for each of the given flavors. */
  
  function populateOptions(flavors) {
  var menu = document.getElementsByName("flavor")[0];
    flavors.forEach(function (element, index){
      var option = document.createElement("option");
      option.value = index;
      option.innerHTML = element.name ;
      menu.appendChild(option);
    })
  }

/*
This was when 
I looked to find all the flavors in linear time.

function geticecream(flavors, name){
  for (var i = flavors.length - 1; i >= 0; i--) {
    if (flavors[i].name === name) {
      return flavors[i];
    }
  };
  return 0;
}
*/

  /* Processes orders for the given set of flavors. When a valid order is made,
   * decrements the quantity of the associated flavor. */
  function processOrders(flavors) {
    for (var i = flavors.length - 1; i >= 0; i--) {
      flavors.element
    };

    var amount_form = document.getElementsByName("amount")[0];
    var menu = document.getElementsByName("flavor")[0];
    var submit_button = document.getElementsByTagName("input")[1]; //BUG: Bag use of unexplained number. 
    
    submit_button.addEventListener("click", function (event){
      event.preventDefault();

      if (amount_form.value && menu.value){
        var amount = +amount_form.value;
        console.log(amount);
        //var name = menu.value;
        //console.log(name);
        var flavor = flavors[menu.value];//geticecream(flavors, name);
        if ( !isNaN(amount) && flavor.quantity >= amount){
          flavor.quantity -= amount;
          console.log(flavor);
          flavor.element.getElementsByClassName("meta")[0].children[0].innerHTML -= amount;
        }
      }

      /*        var li = document.createElement('li');
      li.textContent = taskInput.value;
      li.innerHTML += " <a href=\"#\" class=\"delete\">&#215;</a> <a href=\"#\" class=\"check\">&#9744;</a>";

      addTaskListeners(li);
      taskInput.value = "";
      taskList.appendChild(li);*/
      
    })
  }

  /* Highlights flavors when clicked to make a simple favoriting system. */
  function highlightFlavors(flavors) {
   
    //this also works! indeed, it is better form.
   /*

    flavors.forEach(function (flavor){
      var element = flavor.element;
      element.addEventListener("click", function (event){
        console.log ("event listener added");
        element.classList.toggle("highlighted");

      })
    })
    */

      
    for(var i = flavors.length - 1; i >= 0; i--) { (function (i){

    
      flavors[i].element.addEventListener("click", function (event){
        console.log ("event listener added");
        flavors[i].element.classList.toggle("highlighted");
      })


    }) (i);

    };

  }


  /***************************************************************************/
  /*                                                                         */
  /* Please do not modify code below this line, but feel free to examine it. */
  /*                                                                         */
  /***************************************************************************/


  var CHEAP_PRICE_THRESHOLD = 1.50;

  // setting quantities can modify the size of flavor divs, so apply the grid
  // layout *after* quantities have been set.
  setQuantities();
  var container = document.getElementById('container');
  new Masonry(container, { itemSelector: '.flavor' });

  // calculate statistics about flavors
  var flavors = extractFlavors();
  var averagePrice = calculateAveragePrice(flavors);
  console.log('Average price:', averagePrice);

  var cheapFlavors = findCheapFlavors(flavors, CHEAP_PRICE_THRESHOLD);
  console.log('Cheap flavors:', cheapFlavors);

  // handle flavor orders and highlighting
  populateOptions(flavors);
  processOrders(flavors);
  highlightFlavors(flavors);

})(window, document);
