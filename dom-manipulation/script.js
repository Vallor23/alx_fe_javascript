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
    quoteDisplay.style.background = 'rgb(145, 213, 240)';
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

// Event listener for showing a new quote
showNewQuote.addEventListener('click', showRandomQuote);

//Event listener for exporting quotes to json file
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);

// Call the function to create the form on page load
createAddQuoteForm();