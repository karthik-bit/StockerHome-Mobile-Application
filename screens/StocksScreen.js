import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableHighlight } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

const BottomView = (props) => {
  return (props.stockDetails!==undefined && props.stockDetails!==null)?(
    <View style={styles.bottomview}>
      <Text style={styles.viewHeader}>{props.stockDetails.name}</Text>
      <View style={styles.viewRow}>
      <Text style={styles.viewQuarter}>OPEN</Text>
      <Text style={[styles.viewQuarter,styles.viewRight]}>{props.stockDetails.open}</Text>
      <Text style={styles.viewQuarter}>LOW</Text>
      <Text style={[styles.viewQuarter,styles.viewRight]}>{props.stockDetails.low}</Text>
      </View>
      <View style={styles.viewRow}>
      <Text style={styles.viewQuarter}>CLOSE</Text>
      <Text style={[styles.viewQuarter,styles.viewRight]}>{props.stockDetails.close}</Text>
      <Text style={styles.viewQuarter}>HIGH</Text>
      <Text style={[styles.viewQuarter,styles.viewRight]}>{props.stockDetails.high}</Text>
      </View>
      <View style={styles.viewRow}>
      <Text style={styles.viewQuarter}>VOLUME</Text>
      <Text style={[styles.viewQuarter,styles.viewRight]}>{props.stockDetails.volumes}</Text>
      </View>
    </View>
  ):(
    <View style={styles.bottomview}>
      <Text style={styles.viewHeader}>Details Not Available</Text>
    </View>
  )
}

const WatchList = (props) => {
  return (
    <View style={{ height: '70%' }}>
      <FlatList
        data={props.list}
        keyExtractor = { (item, index) => index.toString() }
        renderItem={(summary) => {
          let detailComp = props.detailsMap.get(summary.item);
          return (
            <TouchableHighlight
              activeOpacity={0.3}
              underlayColor="#727272"
              onPress={() => props.setStock(detailComp)}>
              <View style={styles.itemRow}>
                <Text style={styles.watchItem}>{summary.item}</Text>
                <Text style={[styles.watchItem,styles.watchItemRight]}>{(detailComp !== undefined) ? detailComp.close : 0}</Text>
                <Text style={[styles.watchItem,styles.watchItemRight, (detailComp !== undefined) ? ((detailComp.close - detailComp.open >= 0)?styles.watchItemPlus:styles.watchItemMinus): styles.watchItemPlus]}>{(detailComp !== undefined) ? ((detailComp.close - detailComp.open) / 100).toFixed(2)+'%' : '0%'}</Text>
              </View>
            </TouchableHighlight>
          );
        }}
      />
    </View>
  );
};

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [detailed, setDetailed] = useState(new Map());
  const [stock, setStock] = useState(null);

  const selectStock = (item)=>{
    setStock(item);
  };

  useEffect(() => {
    let watchCounter = 0;
    watchList.forEach(listItem => {
      if (!detailed.has(listItem)) {
        fetch(ServerURL + '/history?symbol=' + watchList[watchCounter])
          .then(response => response.json())
          .then(resData => {
            let detailedMap = detailed;
            detailedMap.set(listItem, resData[0]);
            setDetailed(detailedMap);
            setState(watchList);
          });
      } else {
        setState(watchList);
      }
      watchCounter++;
    });
  }, [watchList]);

  return (
    <View>
      <WatchList list={state} detailsMap={detailed} setStock={selectStock} />
      <BottomView stockDetails={stock}/>
    </View>
  );
}

const styles = StyleSheet.create({

  bottomview: {
    height: '30%',
    width: '100%',
    backgroundColor: '#383838'
  },

  viewHeader: {
    textAlign: 'center',
    color: 'white',
    borderBottomWidth: scaleSize(1),
    borderBottomColor: 'white',
    fontSize: scaleSize(20),
    padding: scaleSize(13),
    fontWeight: 'bold',
  },

  viewRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: scaleSize(1),
    borderBottomColor: '#898888',
    padding: scaleSize(10),
  },

  viewQuarter: {
    color: '#898888',
    width: '25%',
  },

  viewRight: {
    color: '#f4f4f4',
    textAlign: 'right',
    paddingRight: scaleSize(5),
    fontWeight: 'bold',
  },

  itemRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: scaleSize(1),
    borderBottomColor: '#2b2b2b',
    padding: scaleSize(20),
    justifyContent: 'center'
  },

  watchItem: {
    color: 'white',
    width: '33%',
    fontSize: scaleSize(20),
    padding: scaleSize(10),
  },

  watchItemRight: {
    textAlign: 'right'
  },

  watchItemPlus: {
    backgroundColor: '#00f47e',
    borderRadius: scaleSize(10),
    overflow: 'hidden',
  },

  watchItemMinus: {
    backgroundColor: '#ff4916',
    borderRadius: scaleSize(10),
    overflow: 'hidden',
  },

});