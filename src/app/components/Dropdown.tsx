import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";

interface DropdownProps {
  options: string[];
  placeholder: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const Dropdown = ({
  options,
  placeholder,
  selectedValue,
  onValueChange,
}: DropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsVisible(false);
  };

  return (
    <View className="mb-4 w-full">
      <TouchableOpacity
        className="h-16 px-4 border border-gray-300 rounded-xl justify-center bg-white"
        onPress={() => setIsVisible(true)}
      >
        <Text className={selectedValue ? "text-black font-pregular" : "text-gray-400"}>
          {selectedValue || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/30"
          onPress={() => setIsVisible(false)}
        >
          <View className="bg-white w-[85%] rounded-xl py-2 max-h-[300px]">
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-5 py-4 border-b border-gray-100"
                  onPress={() => handleSelect(item)}
                >
                  <Text className="text-base text-black">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Dropdown;
