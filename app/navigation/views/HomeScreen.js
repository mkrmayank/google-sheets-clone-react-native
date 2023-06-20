import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX from 'xlsx';
// import RNFS from 'react-native-fs';

const ROWS = 10;
const COLS = 5;

const HomeScreen = function (navigation) {
  const [gridData, setGridData] = useState([]);

  // Initialize an empty grid on component mount
  useEffect(() => {
    initializeGrid();
  }, []);

  // Function to initialize an empty grid
  const initializeGrid = () => {
    const emptyGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
    setGridData(emptyGrid);
  };

  // Load saved data from AsyncStorage on component mount
  useEffect(() => {
    loadGridData();
  }, []);

  // Function to load saved data from AsyncStorage
  const loadGridData = async () => {
    try {
      const data = await AsyncStorage.getItem('gridData');
      if (data) {
        setGridData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    }
  };

  // Function to save grid data to AsyncStorage
  const saveGridData = async () => {
    try {
      await AsyncStorage.setItem('gridData', JSON.stringify(gridData));
      Alert.alert('Success', 'Grid data saved!');
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  // Function to handle input field change
  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedGridData = [...gridData];
    updatedGridData[rowIndex] = [...updatedGridData[rowIndex]]; // Create a new array for the row
    updatedGridData[rowIndex][colIndex] = value;
    setGridData(updatedGridData);
  };

  // Function to handle download button click
  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
    const sheetData = gridData.map((row) => row.map((cell) => ({ v: cell })));
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const file = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

    // Save the file to mobile storage
    // Here, you would need to use a library or platform-specific APIs to save the file.
    // For example, you can use the `react-native-fs` library to save the file to the device's storage.
    // Refer to the library documentation for the specific implementation details.

    // Example using `react-native-fs` library:
    //
    // const path = RNFS.DocumentDirectoryPath + '/ameya-test.xlsx';
    // RNFS.writeFile(path, file, 'base64')
    //   .then(() => {
    //     Alert.alert('Success', 'Excel file saved!');
    //   })
    //   .catch((error) => {
    //     console.error('Error saving file:', error);
    //   });
  };

  return (
    <View>
      <View>
        <Button title="Download" onPress={handleDownload} />
      </View>
      <View>
        {gridData.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row' }}>
            {row.map((cell, colIndex) => (
              <TextInput
                key={colIndex}
                style={{ flex: 1, borderWidth: 1, padding: 5 }}
                value={cell}
                onChangeText={(value) =>
                  handleInputChange(rowIndex, colIndex, value)
                }
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;
