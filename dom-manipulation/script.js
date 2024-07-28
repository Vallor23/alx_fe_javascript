// Array to store quotes
let quotes =[{
    text: "You never really understand a person until you consider things from his point of view… Until you climb inside of his skin and walk around in it.",category:"Racism and injustice"},
    {text: "Freedom is not worth having if it does not include the freedom to make mistakes.",category:"Freedom and confinment"},
    {text: "People in their right minds never take pride in their talents.",category:"Empathy and Understanding"},
    {text: "Real courage is when you know you're licked before you begin, but you begin anyway and see it through no matter what.",category:"Courage and Moral integrity"},
];

//Function to load quotes from localStorage
function loadQuotes(){
const storedQuotes = localStorage.getItem('quotes');
if (storedQuotes){
    quotes = JSON.parse(storedQuotes);
}
}

//Function to save quotes to local storage
function saveQuotes(){
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

//load quotes from the localstorage when the script runs
loadQuotes();

//Function to load the last viewed quote from session storage
function loadLastViewedQuote(){
    const LastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if(LastViewedQuote){
        document.getElementById('quoteDisplay').textContent = LastViewedQuote;
    }
}

//Function to save the last viewed quote to session storage
function saveLastViewedQuote(quote){
    sessionStorage.setItem('lastViewedQuote', quote);
}

//Loads the last viewed quote from session storage when the script runs
loadLastViewedQuote();

//Get  reference for DOM elements
const showNewQuote = document.getElementById("newQuote");

// Function to display a random quote
function showRandomQuote(){
    const randomIndex = Math.floor(Math.random()*quotes.length)
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomQuote = quotes[randomIndex].text;
    quoteDisplay.innerHTML = randomQuote;
    saveLastViewedQuote(randomQuote);//save the last viewed quote to session storage
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    const quoteInput = document.createElement('input');
    quoteInput.id ='newQuoteText';
    quoteInput.text = 'text';
    quoteInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id ='newQuoteCategory';
    categoryInput.text = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.onclick = addQuote;
    addButton.textContent = 'AddQuote';

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
}
// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if(newQuoteText && newQuoteCategory){
        quotes.push({text: newQuoteText, category: newQuoteCategory});//Add new quote to the array
        saveQuotes();//Save the updated array to the localstorage
        newQuoteText = '';
        newQuoteCategory = '';
    } else {
        alert('Please enter both quote text and category')
    }
}

//Function to export quotes to a JSON file 
function exportQuotes(){
    const dataStr = JSON.stringify(quotes);//convert quotes array to JSON string
    const blob =new Blob([dataStr],{type:'application/json'});//create a Blob
    const url = URL.createObjectURL(blob);//Generate URL for the Blob
    //create an anchor element
    const a =document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url)//Revoke the Blob to free up memory
}

//Function to import files from a json file
function importFromJsonFile() {
    const fileReader = new FileReader();//Creates a new Filereader instance to read the file

    fileReader.onload = function (event) {//Sets up an event handler that will be called when file has been successfully read
    try {
        const importedQuotes = JSON.parse(event.target.result);

        //Validate the implemented data
        if(Array.isArray(importedQuotes) && importedQuotes.every(quote => quote.text && quote.category)) {
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
        } else{
            alert('Invalid JSON format.Please upload a valid quotes file')
        }
    } catch (error) {
        alert('Error reading file. Please ensure its a valid JSON file')
    }   
    };
    // Read the content of the selected file as text
    fileReader.readAsText(event.target.files[0]);
}

// Populate the dropdown with unique categories
function populateCategories() {
    //create a set to store unique categories
    const uniqueCategories = new Set();

    //loop through the quotes array and collect unique categories
    quotes.forEach(quote => {
        uniqueCategories.add(quote.category);
    });

    const categoryFilter = document.getElementById('categoryFilter');
    // categoryFilter.innerHTML = ''; // Clear existing options

    //create and append options to the dropdown
    uniqueCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;// Get the selected category from the dropdown menu
    const filterQuotesArray =quotes.filter(quote => quote.category === selectedCategory);// Filter the quotes based on the selected category
    quoteDisplay.innerHTML = filterQuotesArray.map(quote => quote.text).join ('<br>'); // Update the displayed quotes in the DOM

    // Save the last selected category to local storage
  saveLastSelectedCategory(selectedCategory);
}
    //When user selects a category , save it to local storage
function saveLastSelectedCategory(selectedCategory){
    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

//When page loads,retrieve the last selected category from local storage aand apply it as the initial filter
function applyLastSelectedCategory(){
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if(lastSelectedCategory){
        categoryFilter.value = lastSelectedCategory;
        filterQuotes();//Apply the filter
    }
    
}
populateCategories();

//Syncing data with server and implementing conflict resolution
// use fetch to get data from JSON placeholder
async function fetchQuotesFromServer(){
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        //Assuming each part has a tittle and a body, map them to your quote structure
        const quotes = data.map(post => ({
            text: post.body,
            category: 'General'
        }));
        return quotes;
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return[];
    }
} 

//Post data to server
async function postQuoteToServer(quote){
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        const data = await response.json();
        console.log('Quote posted to server:', data);
    } catch (error) {
        console.error('Error posting quote to server:', error)
    }
}
// Function to start periodic fetching
function syncQuotes(){
    setInterval(async() => {
        const serverQuotes = await fetchQuotesFromServer();
        //Merge server quotes with local quotes and handle conflicts
        mergeQuotes(serverQuotes);
    },6000);
}
//// Function to merge server quotes with local quotes
function mergeQuotes(serverQuotes){
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const mergedQuotes = [...localQuotes];

    serverQuotes.forEach(serverQuote => {
        const existingQuote = mergedQuotes.find(quote => quote.text === serverQuote.text);
        if(!existingQuote){
            mergedQuotes.push(serverQuote)
        }
    });

    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
    displayQuotes(mergedQuotes);//Update the displayed quotes

    notifyUser('Quotes synced with server!');
    
     // Call syncQuotes to ensure synchronization
     syncQuotes();
}
//Update the displayedQuotes to show the merged quotes
function displayQuotes(quotes) {
    quoteDisplay.innerHTML = quotes.map(quote => quote.text).join('<br>');
}

function notifyUser(message){
    const notification = document.createElement('div');
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);//Remove notification after 3 seconds
}

// Function to initialize the applicatio
async function initializeApp() {
    const initialQuotes = await fetchQuotesFromServer();
    mergeQuotes(initialQuotes);
    // startPeriodicFetching();//Start periodic fetching
  }
  // Call the initialization function when the page loads
  initializeApp();

//Call this when the page loads
applyLastSelectedCategory();

// Event listener for showing a new quote
showNewQuote.addEventListener('click', showRandomQuote);

//Event listener for exporting quotes to json file
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);

// Call the function to create the form on page load
createAddQuoteForm();