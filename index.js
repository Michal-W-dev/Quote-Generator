'use strict';
// 
let errorCount = 0;

// DOM's elements
const quoteContainer = document.querySelector('.quote-container')
const quoteBtn = document.querySelector('.new-quote-button')
const twitterBtn = document.querySelector('.twitter-button')
const quoteAuthor = document.querySelector('.quote-author')
const quoteText = document.querySelector('.quote')
const loader = document.querySelector('.loader')

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}
function hideLoadingSpinner() {
    if (!loader.hidden) { quoteContainer.hidden = false; loader.hidden = true; }
}

// Get Quote From API
async function fetchQuote() {
    showLoadingSpinner()
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'
    try {
        const res = await axios.get(proxyUrl + apiUrl)
        const data = res.data;
        console.log(data)
        quoteText.innerText = data.quoteText;
        // Reduce font size for long quotes
        (data.quoteText.length > 150) ? quoteText.classList.add('long-quote') : quoteText.classList.remove('long-quote');
        // If (quoteAuthor is undefined) then 'Unknown'
        quoteAuthor.innerText = (data.quoteAuthor) ? data.quoteAuthor : quoteAuthor.innerText = 'Unknown';
        hideLoadingSpinner()
        // throw new Error('oops')
    }
    catch (err) {
        if (errorCount < 20) {
            errorCount++;
            fetchQuote();
            console.log(errorCount)
        } else {
            console.error('Too many errors fetching quote.', err);
            hideLoadingSpinner();
        }
    }
}
function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.innerText} - ${quoteAuthor.innerText}`
    window.open(twitterUrl, '_blank')
}
twitterBtn.addEventListener('click', tweetQuote)
quoteBtn.addEventListener('click', function () {
    setTimeout(() => {
        fetchQuote()
    }, 300)
});
// On Load
fetchQuote()
