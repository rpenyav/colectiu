import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    console.log(`Storage - getItem - Platform: ${Platform.OS}, Key: ${key}`);
    try {
      if (Platform.OS === "web") {
        const value = await AsyncStorage.getItem(key);
        console.log(
          `Storage - getItem - AsyncStorage - Key: ${key}, Value: ${value}`
        );
        return value;
      } else {
        const value = await SecureStore.getItemAsync(key);
        console.log(
          `Storage - getItem - SecureStore - Key: ${key}, Value: ${value}`
        );
        return value;
      }
    } catch (error) {
      console.error(`Storage - Error getting item ${key}:`, error);
      throw error;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    console.log(
      `Storage - setItem - Platform: ${Platform.OS}, Key: ${key}, Value: ${value}`
    );
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.setItem(key, value);
        console.log(
          `Storage - setItem - AsyncStorage - Key: ${key} set successfully`
        );
      } else {
        await SecureStore.setItemAsync(key, value);
        console.log(
          `Storage - setItem - SecureStore - Key: ${key} set successfully`
        );
      }
    } catch (error) {
      console.error(`Storage - Error setting item ${key}:`, error);
      throw error;
    }
  },

  async deleteItem(key: string): Promise<void> {
    console.log(`Storage - deleteItem - Platform: ${Platform.OS}, Key: ${key}`);
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem(key);
        console.log(
          `Storage - deleteItem - AsyncStorage - Key: ${key} deleted successfully`
        );
      } else {
        await SecureStore.deleteItemAsync(key);
        console.log(
          `Storage - deleteItem - SecureStore - Key: ${key} deleted successfully`
        );
      }
    } catch (error) {
      console.error(`Storage - Error deleting item ${key}:`, error);
      throw error;
    }
  },
};
