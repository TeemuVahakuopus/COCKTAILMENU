import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [cocktail, setCocktail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const recipeRef = useRef(null);

  const fetchRandomCocktail = async () => {
    const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    setCocktail(response.data.drinks[0]);
  };

  const searchCocktail = async (event) => {
    event.preventDefault();
    if (!searchTerm) return;
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    if (response.data.drinks) {
      setSearchResults(response.data.drinks);
    } else {
      setCocktail(null);
      setSearchResults([]);
    }
    setSearchTerm('');
  };

  const showRecipe = (drink) => {
    setCocktail(drink);
    recipeRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchRandomCocktail();
  }, []);

  return (
    <div className="App">
      <h1>Cocktail Recipe App</h1>
      {cocktail ? (
        <div ref={recipeRef}>
          <h2>{cocktail.strDrink}</h2>
          <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
          <p>{cocktail.strInstructions}</p>
        </div>
      ) : (
        <p>No cocktail selected. Please search for a cocktail.</p>
      )}
      <form onSubmit={searchCocktail}>
        <input 
          type="text" 
          placeholder="Search for a cocktail" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button type="submit">Search</button>
      </form>
      {searchResults.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul>
            {searchResults.map((drink) => (
              <li key={drink.idDrink}>
                <h3>{drink.strDrink}</h3>
                <button onClick={() => showRecipe(drink)}>Show Recipe</button>
                <img src={drink.strDrinkThumb} alt={drink.strDrink} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {searchResults.length === 0 && searchTerm && (
        <p>Can't find any cocktails for "{searchTerm}".</p>
      )}
    </div>
  );
}

export default App;
