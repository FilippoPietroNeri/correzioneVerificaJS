const loadCTRBTN = document.getElementById('loadCountriesBTN');
const loadCITYBTN = document.getElementById('loadCitiesBTN');

const cityList = document.getElementById('city-list');
const customerList = document.getElementById('customer-list');

let selectedCountry = "";

loadCTRBTN.addEventListener('click', function (ev) {
    loadCTRBTN.style.display = "none";
    loadCountries();
    cityList.style.display = "block";
});

loadCitiesBTN.addEventListener('click', function (ev) {
    const e = cityList.querySelectorAll('a')
    if (e.length > 0) {
        e.forEach(atag => {
            atag.remove();
        });
    }
    loadCities(selectedCountry);
})

function loadCountries() {
    fetch('/get_countries')
        .then(response => response.json())
        .then(data => {
            const countryList = document.getElementById('country-list');
            data.forEach(country => {
                const countryLink = document.createElement('a');
                countryLink.href = '#';
                countryLink.textContent = country;
                countryLink.addEventListener('click', () => {
                    selectedCountry = country;
                });
                countryList.appendChild(countryLink);
                countryList.appendChild(document.createElement('br'));
            });
        });
}

function loadCities(country) {
    fetch(`/get_cities/${country}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(city => {
                console.log(city)
                const cityLink = document.createElement('a');
                cityLink.href = '#';
                cityLink.textContent = `${city.Address} (${city.Customers})`;
                cityLink.addEventListener('click', () => loadCustomers(city.Customers));
                cityList.appendChild(cityLink);
            });
        });
}

function loadCustomers(city) {
    fetch(`/get_customers?city=${city}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            customerList.innerHTML = '<h2>Elenco Clienti</h2>';
            let innerData = "";
            if (data.length > 0) {
                data.forEach(city => {
                    Object.entries(city).forEach(entry => {
                        const [key, value] = entry;
                        innerData += `<strong>${key}</strong> ${value} <br>`
                    });
                    innerData += "<br>"
                })

                customerList.innerHTML += innerData;
            } else {
                customerList.textContent = 'Nessun cliente trovato per questa città.';
            }
        });
}