import React, { useState, useEffect, useRef } from "react";
import {
  VStack,
  Box,
  Text,
  Input,
  HStack,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Indicates if AI is typing
  const messageBoxRef = useRef(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true); // Start typing indicator

    try {
      const response = await axios.post(
        "https://howard-backend.onrender.com/chat",
        { content: input }
      );

      // Parse response based on the expected format
      const aiMessage = response.data.message?.content || "No response received.";
      setMessages((prev) => [...prev, { role: "assistant", content: aiMessage }]);
    } catch (error) {
      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false); // Stop typing indicator
    }
  };

  // Handle Enter key press in the input box
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  // Scroll to the latest message
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <VStack spacing={6} w="full" align="center">
      <Text fontSize="2xl" color="blue.600" fontWeight="bold">
        Chat with HOWARD
      </Text>

      {/* Chat Box */}
      <Box
        bg="gray.50"
        w="100%"
        h="60vh"
        overflowY="auto"
        p={5}
        borderRadius="lg"
        boxShadow="lg"
        ref={messageBoxRef}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            mb={4}
            textAlign={message.role === "user" ? "right" : "left"}
          >
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={message.role === "user" ? "blue.600" : "gray.500"}
            >
              {message.role === "user" ? "You" : "HOWARD"}
            </Text>
            <Box
              display="inline-block"
              bg={message.role === "user" ? "blue.500" : "gray.200"}
              color={message.role === "user" ? "white" : "blue.800"}
              p={3}
              borderRadius="lg"
              boxShadow="sm"
              maxWidth="80%"
              wordBreak="break-word"
            >
              {message.content}
            </Box>
          </Box>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <Box textAlign="left" mt={2}>
            <Text fontSize="sm" fontWeight="bold" color="gray.500">
              HOWARD
            </Text>
            <Box
              display="inline-block"
              bg="gray.200"
              color="blue.800"
              p={3}
              borderRadius="lg"
              boxShadow="sm"
              maxWidth="80%"
            >
              <div style={{ display: "flex", gap: "4px" }}>
                <Box className="dot" bg="blue.600" w="8px" h="8px" borderRadius="full" animation="typing 1.5s infinite" />
                <Box className="dot" bg="blue.600" w="8px" h="8px" borderRadius="full" animation="typing 1.5s infinite 0.5s" />
                <Box className="dot" bg="blue.600" w="8px" h="8px" borderRadius="full" animation="typing 1.5s infinite 1s" />
              </div>
            </Box>
          </Box>
        )}
      </Box>

      {/* Input and Send Button */}
      <HStack w="100%" spacing={4}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger send on Enter key
          placeholder="Type your message..."
          size="lg"
          bg="white"
          color="blue.800"
          borderColor="blue.500"
          focusBorderColor="blue.600"
          _placeholder={{ color: "gray.500" }}
        />

        <Button
          onClick={handleSendMessage}
          colorScheme="blue"
          size="lg"
          bg="blue.400" // Using a valid Chakra UI color
          isDisabled={!input.trim() || isLoading}
          _hover={{ bg: "blue.500" }} // Hover effect with a darker shade
        >
          Send
        </Button>
      </HStack>
    </VStack>
  );
}
