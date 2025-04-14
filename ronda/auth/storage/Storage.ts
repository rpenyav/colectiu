import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        const value = await AsyncStorage.getItem(key);

        return value;
      } else {
        const value = await SecureStore.getItemAsync(key);

        return value;
      }
    } catch (error) {
      console.error(`Storage - Error getting item ${key}:`, error);
      throw error;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Storage - Error setting item ${key}:`, error);
      throw error;
    }
  },

  async deleteItem(key: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Storage - Error deleting item ${key}:`, error);
      throw error;
    }
  },
};
