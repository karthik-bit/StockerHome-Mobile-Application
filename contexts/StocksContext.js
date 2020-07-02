import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  async function addToWatchlist(newSymbol) {

    var currentWatchList = [];
    (state === null)?currentWatchList=[]:currentWatchList=JSON.parse(JSON.stringify(state));

    (!currentWatchList.includes(newSymbol))?currentWatchList.push(newSymbol):null;

    AsyncStorage.setItem('watchlist',JSON.stringify(currentWatchList));
    setState(currentWatchList.reverse());
    console.log("Adding Items to watchlist",currentWatchList);
  }

  useEffect(() => {
    AsyncStorage.getItem('watchlist')
      .then(response => JSON.parse(response))
      .then(resArr => {
        setState((resArr === null)?[]:resArr);
      });
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};