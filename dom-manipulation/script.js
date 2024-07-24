// Array to store quotes
let quotes =[{
    text: "You never really understand a person until you consider things from his point of view… Until you climb inside of his skin and walk around in it.",category:"Racism and injustice"},
    {text: "Freedom is not worth having if it does not include the freedom to make mistakes.",category:"Freedom and confinment"},
    {text: "People in their right minds never take pride in their talents.",category:"Empathy and Understanding"},
    {text: "Real courage is when you know you're licked before you begin, but you begin anyway and see it through no matter what.",category:"Courage and Moral integrity"},
];

//Get  reference for DOM elements
const showNewQuote = document.getElementById("newQuote");
const newQuoteText = document.getElementById('newQuoteText').value;
const newQuoteCategory = document.getElementById('newQuoteCategory').value;

// Function to display a random quote
function showRandomQuote(){
    const randomIndex = Math.floor(Math.random()*quotes.length)
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = quotes[randomIndex].text;
    quoteDisplay.style.background = 'rgb(145, 213, 240)';
}
// Function to add a new quote
function addQuote() {
    if(newQuoteText && newQuoteCategory){
        quotes.push({text: newQuoteText, category: newQuoteCategory});
        newQuoteText = '';
        newQuoteCategory = '';
    } else {
        alert('Please enter both quote text and category')
    }
}
// Event listener for showing a new quote
showNewQuote.addEventListener('click', showRandomQuote);