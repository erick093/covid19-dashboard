import React, {Fragment} from "react";
import { Subject,empty,of } from "rxjs";
import {
    filter,
    debounceTime,
    distinctUntilChanged,
    switchMap
} from "rxjs/operators";
import {fetchCountry} from "../Api";


const SearchBar = (props) => {
    const [searchKey, setSearchKey] = React.useState("");
    const [countries, setCountries] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSelected, setIsSelected] = React.useState(false);
    const subjectRef = React.useRef();

    function onChangeSearchKey(e) {
        const searchKey = e.target.value;
        setSearchKey(searchKey);
        setIsSelected(false);
        subjectRef.current.next(searchKey);
    }
    function onClick(e){
        const searchKey =  e.currentTarget.innerText;
        setSearchKey(searchKey);
        setIsSelected(true);
        props.parentCallback(searchKey);
    }



    React.useEffect(() => {
        subjectRef.current = new Subject();
        const subscription = subjectRef.current
            .pipe(
                filter(function(text) {
                    return text.length >= 2; // Only if the text is longer than 2 characters
                }),
                debounceTime(750),
                distinctUntilChanged(),
                switchMap(keyword => {
                    setIsLoading(true);
                    return fetchCountry(keyword);
                })
            )
            .subscribe(data => {
                setCountries(data);
                setIsLoading(false);
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);
    return (

        <div className="SearchBar">
            <div className="form-group">
            <input
                type="text"
                className="form-control"
                placeholder="Please search a country"
                onChange={onChangeSearchKey}
                value={searchKey}
            />
            {isLoading ? "Loading" : null}
            <ul className="suggestions">

            {  !isSelected ? (
                countries.map(country => {
                return <li key={country} onClick={ onClick}>{country} </li>;
            })): null   }
            </ul>
            </div>
        </div>

    );
}

export default SearchBar