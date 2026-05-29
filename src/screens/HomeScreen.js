import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HabitItem from '../components/HabitItem';

function HomeScreen({ navigation }) {
  var [habits, setHabits] = useState([]);

  // Загружаем привычки при старте
  useEffect(function() {
    loadHabits();
  }, []);

  async function loadHabits() {
    try {
      var savedHabits = await AsyncStorage.getItem('habits');
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    } catch (error) {
      console.log('Ошибка загрузки:', error);
    }
  }

  async function saveHabits(newHabits) {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(newHabits));
    } catch (error) {
      console.log('Ошибка сохранения:', error);
    }
  }

  function handleAddHabit(habitName) {
    var newHabit = {
      id: Date.now().toString(),
      name: habitName,
      completed: false,
      createdAt: new Date().toLocaleString('ru-RU')
    };

    var newHabits = [];
    for (var i = 0; i < habits.length; i++) {
      newHabits.push(habits[i]);
    }
    newHabits.push(newHabit);

    setHabits(newHabits);
    saveHabits(newHabits);
  }

  function handleToggleComplete(habitId) {
    var newHabits = [];
    for (var i = 0; i < habits.length; i++) {
      var habit = habits[i];
      if (habit.id === habitId) {
        var updatedHabit = {
          id: habit.id,
          name: habit.name,
          completed: !habit.completed,
          createdAt: habit.createdAt
        };
        newHabits.push(updatedHabit);
      } else {
        newHabits.push(habit);
      }
    }

    setHabits(newHabits);
    saveHabits(newHabits);
  }

  function handleDeleteHabit(habitId) {
    var newHabits = [];
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].id !== habitId) {
        newHabits.push(habits[i]);
      }
    }

    setHabits(newHabits);
    saveHabits(newHabits);
  }

  function renderItem(item) {
    return (
      <HabitItem
        habit={item}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteHabit}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои привычки</Text>

      <Button
        title="Добавить привычку"
        onPress={function() {
          navigation.navigate('AddHabit', { onAddHabit: handleAddHabit });
        }}
      />

      {habits.length === 0 ? (
        <Text style={styles.emptyText}>Привычек пока нет</Text>
      ) : (
        <FlatList
          data={habits}
          renderItem={function(data) {
            return renderItem(data.item);
          }}
          keyExtractor={function(item) {
            return item.id;
          }}
          style={styles.list}
        />
      )}
    </View>
  );
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16
  },
  list: {
    marginTop: 20
  }
});

export default HomeScreen;