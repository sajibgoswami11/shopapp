import React, { Component } from 'react';
import {
  TouchableHighlight,
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  ListView,
  ToolbarAndroid
} from 'react-native';
import * as firebase from 'firebase';
import ListItem from './ListItem.js';
import styles from '../styles.js';
import FloatingActionButton from 'react-native-action-button';

// Initialize Firebase (unused for now)
var config = {
    apiKey: "AIzaSyDg7tXRyywp40iuHnStkoMmz-mfy-AD7bg",
    authDomain: "grosserylist-af1bd.firebaseapp.com",
    databaseURL: "https://grosserylist-af1bd.firebaseio.com",
    projectId: "grosserylist-af1bd",
    storageBucket: "grosserylist-af1bd.appspot.com",
};
const firebaseApp = firebase.initializeApp(config);

class App extends React.Component{

  constructor(props) {
    super(props);
    this.tasksRef = firebaseApp.database().ref();
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource: dataSource, // dataSource for our list
      newTask: "" // The name of the new task
    };
  }

  componentDidMount() {

    this.listenForTasks(this.tasksRef);
  }

  render() {
    return (
      <View style={styles.container}>
  			<ToolbarAndroid
          style={styles.navbar}
          title="Todo List" />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listView}/>
        <TextInput
           value={this.state.newTask}
           style={styles.textEdit}
           onChangeText={(text) => this.setState({newTask: text})}
           placeholder="New Task"
         />

        <FloatingActionButton

          buttonColor="rgba(231,76,60,1)"
          onPress={this._addTask.bind(this)}/>
      </View>
    );
  }

  _renderItem(task) {
    const onTaskCompletion = () => {
      // removes the item from the list
      this.tasksRef.child(task._key).remove()
    };
       return (
          <ListItem task={task}
           onTaskCompletion={onTaskCompletion} />  ); }

  _addTask() {
    if (this.state.newTask === "") {
      return;
    }
    this.tasksRef.push({ name: this.state.newTask});
    this.setState({newTask: ""});}

  listenForTasks(tasksRef) {
    // listen for changes to the tasks reference, when it updates we'll get a
    // dataSnapshot from firebase
    tasksRef.on('value', (dataSnapshot) => {
      // transform the children to an array
      var tasks = [];
      dataSnapshot.forEach((child) => {
        tasks.push({
          name: child.val().name,
          _key: child.key
        });
      });

      // Update the state with the new tasks
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(tasks)
      });
    });
  }
}
export default App;
