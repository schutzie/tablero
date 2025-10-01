import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { GameEvent } from '../model/gameEvent'
import { sampleData} from '../_test/testData/sampleData';

export default function EventListScreen() {
  const ItemRender = (gameEvent: GameEvent) =>
  {
    return <></>
  }

  return (
    <View>
      <Text>{sampleData.game.homeTeam.name}</Text>
      {/* <Text>Event List</Text>
      <FlatList data={undefined} renderItem={undefined}>
        
      </FlatList> */}
    </View>
  )
}

const styles = StyleSheet.create({})