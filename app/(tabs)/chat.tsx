import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Send, Bot, User } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { chatApi } from "@/services/api/chat";
import Colors from "@/constants/Colors";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: "1",
      content: `¡Hola ${user?.name?.split(" ")[0]}! Soy tu asistente virtual de CADE Ejecutivos 2025. ¿En qué puedo ayudarte hoy?`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [user]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      console.log("Sending message to Watson:", inputText);

      const response = await chatApi.sendMessage(userMessage.content);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);

      // Fallback response on error
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, no pude procesar tu mensaje en este momento. Por favor intenta de nuevo.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Lima",
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={{ width: "100%" }}
      className={`flex-row mb-4 ${item.isUser ? "justify-end" : "justify-start"}`}
    >
      {!item.isUser && (
        <View
          style={{ backgroundColor: Colors.primary }}
          className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-1"
        >
          <Bot size={16} color="#FFFFFF" />
        </View>
      )}

      <View
        style={{
          backgroundColor: item.isUser ? Colors.primary : Colors.cardBackground,
          borderColor: item.isUser ? Colors.primary : Colors.border,
          maxWidth: "75%",
        }}
        className={`px-4 py-3 rounded-2xl border ${
          item.isUser ? "rounded-br-md" : "rounded-bl-md"
        }`}
      >
        <Text
          style={{
            color: item.isUser ? "#FFFFFF" : Colors.text,
          }}
          className="text-base leading-5"
        >
          {item.content}
        </Text>
        <Text
          style={{
            color: item.isUser ? "#FFFFFF80" : "#888888",
          }}
          className="text-xs mt-1"
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>

      {item.isUser && (
        <View
          style={{ backgroundColor: Colors.backgroundTertiary }}
          className="w-8 h-8 rounded-full items-center justify-center ml-3 mt-1"
        >
          <User size={16} color={Colors.primary} />
        </View>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={{ width: "100%" }} className="flex-row justify-start mb-4">
      <View
        style={{ backgroundColor: Colors.primary }}
        className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-1"
      >
        <Bot size={16} color="#FFFFFF" />
      </View>
      <View
        style={{
          backgroundColor: Colors.cardBackground,
          borderColor: Colors.border,
          maxWidth: "75%",
        }}
        className="border px-4 py-3 rounded-2xl rounded-bl-md"
      >
        <Text style={{ color: "#888888" }} className="italic">
          Escribiendo...
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#2c3c94" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#2c3c94" }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2c3c94"
          translucent={false}
        />
        <View style={{ backgroundColor: "#2c3c94", height: 30 }} />
        <View style={{ flex: 1, backgroundColor: "#eff3f6" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={{ backgroundColor: Colors.backgroundSecondary }}
          className="flex-auto px-2 py-4"
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isLoading ? renderTypingIndicator : null}
        />

        <View
          style={{
            backgroundColor: Colors.backgroundSecondary,
            borderTopColor: Colors.border,
            paddingBottom: isInputFocused ? 0 : 70,
          }}
          className="flex-row items-center px-4 py-3 border-t"
        >
          <TextInput
            style={{
              backgroundColor: Colors.background,
              borderColor: Colors.border,
              color: Colors.text,
            }}
            className="flex-1 border rounded-full px-4 py-3 mr-3"
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#888888"
            value={inputText}
            onChangeText={setInputText}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            style={{
              backgroundColor:
                inputText.trim() && !isLoading
                  ? Colors.primary
                  : Colors.backgroundTertiary,
            }}
            className="w-12 h-12 rounded-full items-center justify-center"
          >
            <Send
              size={20}
              color={
                inputText.trim() && !isLoading
                  ? "#FFFFFF"
                  : "#888888"
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </View>
  );
}
