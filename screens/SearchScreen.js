import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, TextInput, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '@react-navigation/native';

const Header = (props) => {
  return (
    <View>
      <Text style={styles.headerTitle}>
        Type a company name or stock symbol:
      </Text>
      <View
        style={styles.headerBox}>
        <Ionicons name="md-search" size={scaleSize(30)} color={'white'} />
        <TextInput
          onChangeText={text => props.searchText(text)}
          style={styles.headerTxt}
          autoCapitalize={"characters"}
          selectionColor={'white'}
        />
      </View>
    </View>
  );
}

const SearchItem = ({ symbol, name, isClicked }) => {
  return (
    <View key={symbol}>
      <TouchableOpacity style={styles.searchItem} onPress={() => isClicked(symbol)}>
        <Text style={styles.searchItemSymbol}>{symbol}</Text>
        <Text style={styles.searchItemName}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const SearchList = (props) => {
  return (
    <SafeAreaView>
      <FlatList
        keyExtractor={item => item.id}
        data={props.componentsArr}
        renderItem={({ item }) => <SearchItem 
          symbol={item.symbol}
          name={item.name}
          isClicked={props.clicked} />}
      />
    </SafeAreaView>
  );
}

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState([]);
  const [text, setText] = useState("");
  const [curComponent, setCurComponent] = useState(null);
  let keyCounter = 0;

  useEffect(() => {
    fetch(ServerURL + '/all')
      .then(res => res.json())
      .then(resData => {
        
        resData.forEach(item => {
          item.id = keyCounter.toString();
          keyCounter++;
        });
        setState(resData);
      });
  }, []);

  useEffect(()=>{
    curComponent!==null?addToWatchlist(curComponent):null;
    navigation.navigate({name: 'Stocks'});
  },[curComponent]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View key="searchContainer">
        <Header searchText={setText}/>
        <SearchList componentsArr={state.filter((component)=>(component.symbol).includes(text))} clicked={setCurComponent} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  searchItem: {
    borderBottomWidth: 1, 
    borderBottomColor: '#3a3a3a',
    padding: scaleSize(18), 
  },

  searchItemSymbol: {
    fontSize: scaleSize(20),
    color: 'white',
  },

  searchItemName: {
    fontSize: scaleSize(15),
    color: 'white',
  },

  headerTitle: {
    color: 'white',
    fontSize: scaleSize(16),
    textAlign: 'center',
    marginBottom: scaleSize(12),
  },

  headerBox: {
    display: 'flex',
    flexDirection: 'row',
    height: scaleSize(45),
    backgroundColor: '#3f3f3f',
    borderRadius: scaleSize(30),
    padding: scaleSize(10),
    margin: scaleSize(10),
  },

  headerTxt: {
    width: '100%',
    color: 'white',
    paddingLeft: scaleSize(10),
    fontSize: scaleSize(20),
  },

});