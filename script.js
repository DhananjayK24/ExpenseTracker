const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const perDay = document.getElementById('todaySpent');
const previousDay = document.getElementById('yesterdaySpent');

// const dummyTransactions = [
//   {id:1, text: 'Flower', amount: -100},
//   {id:2, text: 'Coffee', amount: -45},
//   {id:3, text: 'Cash', amount: +200},
// ];

// Calculate today's date
let today = new Date();

let year = today.getFullYear();
let month = today.getMonth() + 1; // Months are zero-indexed, so add 1
let day = today.getDate();

// Create a string representation of the date in the format YYYY-MM-DD
let uniqueDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

// Calculate yesterday's date
let yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
let yesterdayYear = yesterday.getFullYear();
let yesterdayMonth = yesterday.getMonth() + 1;
let yesterdayDay = yesterday.getDate();

let yesterdayDate = `${yesterdayYear}-${yesterdayMonth < 10 ? '0' : ''}${yesterdayMonth}-${yesterdayDay < 10 ? '0' : ''}${yesterdayDay}`;

//Local Storage 
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null 
                   ? localStorageTransactions : [];

const generateID = () => {
    return Math.floor(Math.random()*100000000);
  };
  
  const addTransaction = (e) => {
    e.preventDefault();
    
    if(text.value.trim() === '' || amount.value.trim() === ''){
      alert('Please add values...');
    }
    else{

      const transaction = {
        id: generateID(),
        text: text.value, 
        amount: +amount.value,
        day: uniqueDate
      };

    transactions.push(transaction);

    addTransactionDom(transaction);

    updateList();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
};


const addTransactionDom = (transac) =>{
  let componentsDate = transac.day.split('-');
  let reversedDate = `${componentsDate[2]}-${componentsDate[1]}-${componentsDate[0]}`;
  
  const sign = transac.amount < 0 ? '-' : '+' ;
  
  const item = document.createElement('li');
  
  item.classList.add(transac.amount < 0 ? 'minus' : 'plus');
  
  item.innerHTML = `${transac.text}   <span class="transaction-date">${(reversedDate)}</span> <span>${sign}${Math.abs(transac.amount)}</span> <button class='delete-btn' onclick="removeTransaction(${transac.id})">x</button>`;
  
  list.appendChild(item);
};

const updateList = () => {
  const amounts = transactions.map(transac => transac.amount);
  const total = amounts.reduce((acc, transac) => (acc += transac), 0).toFixed(2);

  const income = amounts.filter(transac => transac > 0)
                        .reduce((acc, transac) => (acc+=transac), 0)
                        .toFixed(2);
  
  const expense = (amounts.filter(transac => transac < 0)
                        .reduce((acc, transac) => (acc+=transac), 0))*-1
                        .toFixed(2);
  
  const perDaySpent = transactions.filter(transac => transac.day == uniqueDate)
                             .map(transac => transac.amount)
                             .filter(transac => transac < 0)
                             .reduce((acc, transac) => (acc += transac), 0);                            
  
  const yesterdaySpent = transactions.filter(transac => transac.day == yesterdayDate)
                             .map(transac => transac.amount)
                             .filter(transac => transac < 0)
                             .reduce((acc, transac) => (acc += transac), 0);                            
  
  balance.innerText = `₹${total}`;
  money_plus.innerText = `₹${income}`;
  money_minus.innerText = `₹${expense}`;
  perDay.innerText = `₹${Math.abs(perDaySpent)}`;
  previousDay.innerText = `₹${Math.abs(yesterdaySpent)}`;
};

const removeTransaction = (id) => {
  const transactionToRemove = transactions.find(transac => transac.id === id);

  // Display a confirmation dialog with transaction details
  const userConfirmed = window.confirm(`Are you sure you want to remove the transaction with amount ${transactionToRemove.amount}? This will also remove the amount from your account.`);

  // Check if the user confirmed
  // Check if the user confirmed
  if (userConfirmed) {
    // Remove the transaction
    transactions = transactions.filter(transac => transac.id !== id);

    // Update local storage
    updateLocalStorage();

    // Initialize (assuming init() sets up your UI)
    init();
  } else {
    // User canceled, do nothing or handle accordingly
  }
};

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

const init = () =>{
  list.innerHTML = '';

  transactions.forEach(addTransactionDom);
  updateList();
};

init();

form.addEventListener('submit', addTransaction);