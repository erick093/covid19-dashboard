import {from} from 'rxjs';
export const BASE_API_URL = '';


export const testAPI = () =>{
    from(
        fetch(BASE_API_URL)
        .then( res => res.json())
        .then( res => console.log(res))
    )
    
}
export const getCountryData = (country) =>
    from(fetch(`${BASE_API_URL}/casesWeekly`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(country)
        
    })
    .then((res)=> res.json()));

export const getGlobalDeaths = () =>
    from(
        fetch(`${BASE_API_URL}/globalDeaths`)
            .then( res => res.json()));

export const getGlobalConfirmed = () =>
    from(
        fetch(`${BASE_API_URL}/globalConfirmed`)
            .then( res => res.json()));

export const getGlobalRecovered = () =>
    from(
        fetch(`${BASE_API_URL}/globalRecovered`)
            .then( res => res.json()));

export const getListCountries = () =>
    from(
        fetch(`${BASE_API_URL}/getListCountries`)
            .then( res => res.json()));

export function fetchCountry(keyword = "") {
    return fetch(`${BASE_API_URL}/getListCountries`)
        .then(resp => resp.json())
        .then(data => {
            return data.filter(data =>
                data.toUpperCase().includes(keyword.toUpperCase()));
        });
}
    
    


