import './css/styles.css';
import debounce from 'lodash.debounce'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';


const DEBOUNCE_DELAY = 300;
const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


searchBox.addEventListener("input", debounce(onSearchBox, DEBOUNCE_DELAY))

function onSearchBox(e) {
     e.preventDefault();
  const country = e.target.value.trim();
  if (country !== '') {
    clearMarkup();
    fetchCountries(country)
      .then(countries => {
        // console.log(countries);
        if (countries.length >= 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
        if (countries.length < 10 && countries.length > 2) {
          renderCountryList(countries);
        } else {
          renderCountryCard(countries);
        }
      })
      .catch(error => {
        Notify.failure(error.message);
      });
  }
  clearMarkup();
};

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}


function renderCountryCard(countries) {
     const markupCountryCard = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `<div class="wrap"><img src=${flags.svg} alt="flag" width="50"/><h2>${name.common}</h2></div><p><strong>Capital:</strong> ${capital}</p><p><strong>Population:</strong> ${population}</p><p><strong>Languages:</strong> ${Object.values(
              languages
            )}</p>`;
    })
    .join('');
  countryInfo.insertAdjacentHTML('beforeend', markupCountryCard);
};

function renderCountryList(countries) {
     const markupCountryList = countries
    .map(({ flags, name }) => {
      return `<li><div class="wrap"><img src=${flags.svg} alt="flag" width="40"/><h3>${name.common}</h3></div></li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markupCountryList);
};

// console.log(searchBox)
// console.log(countryList)
// console.log(countryInfo)
