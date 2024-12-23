import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  Flex,
  Container,
  IconButton,
} from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import ChatInterface from "./components/chatInterface";
import HomeAutomation from "./components/homeAutomation";

const App = () => {
  const [activeTab, setActiveTab] = useState("ai");
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar toggle

  return (
    <Router>
      <Flex
        h="100vh"
        bgGradient="linear(to-br, blue.500, purple.400)"
        color="white"
        flexDirection={["column", "row"]} // Responsive layout
      >
        {/* Sidebar */}
        <Box
          w={isCollapsed ? ["100%", "10%"] : ["100%", "20%"]}
          minH={["10%", "100%"]} // Full height on desktop, reduced on mobile
          p={isCollapsed ? 4 : 6}
          boxShadow="2xl"
          bg="blue.300"
          color="gray.800"
          display="flex"
          flexDirection={["row", "column"]} // Row for mobile, column for desktop
          justifyContent="space-between"
          alignItems="center"
          borderTopRightRadius={["none", "2xl"]}
          borderBottomRightRadius={["none", "2xl"]}
          transition="width 0.3s ease"
        >
          {/* Toggle Button */}
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="sm"
            aria-label="Toggle sidebar"
            bg="transparent"
            color="gray.700"
            _hover={{ bg: "gray.100" }}
          >
            {isCollapsed ? "☰" : "✖"} {/* Simplified text-based icons */}
          </IconButton>

          {!isCollapsed && (
            <VStack spacing={[2, 10]} align="center" w="100%">
              {/* App Name */}
              <Text fontSize={["xl", "4xl"]} fontWeight="bold" color="blue.600">
                Howard AI
              </Text>

              {/* Navigation Buttons */}
              <VStack align="stretch" spacing={6} w="100%">
                <Button
                  onClick={() => setActiveTab("ai")}
                  colorScheme="blue"
                  size="lg"
                  borderRadius="full"
                  bg={activeTab === "ai" ? "blue.100" : "transparent"}
                  color={activeTab === "ai" ? "blue.600" : "gray.700"}
                  _hover={{ transform: "scale(1.05)", shadow: "md" }}
                >
                  AI Chat
                </Button>
                <Button
                  onClick={() => setActiveTab("home")}
                  colorScheme="blue"
                  size="lg"
                  borderRadius="full"
                  bg={activeTab === "home" ? "blue.100" : "transparent"}
                  color={activeTab === "home" ? "blue.600" : "gray.700"}
                  _hover={{ transform: "scale(1.05)", shadow: "md" }}
                >
                  Home Automation
                </Button>
              </VStack>
            </VStack>
          )}

          {/* Footer */}
          {!isCollapsed && (
            <Text
              fontSize="sm"
              color="gray.500"
              mt={[0, 10]}
              textAlign="center"
              w="100%"
            >
              © 2024 Howard Inc.
            </Text>
          )}
        </Box>

        {/* Main Content */}
        <Box
          w={isCollapsed ? ["100%", "90%"] : ["100%", "80%"]}
          p={[6, 12]}
          overflowY="auto"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="white"
          borderTopLeftRadius={["none", "2xl"]}
          borderBottomLeftRadius={["none", "2xl"]}
          boxShadow="inner"
          transition="width 0.3s ease"
        >
          <Container maxW="container.lg">
            {activeTab === "ai" && <ChatInterface />}
            {activeTab === "home" && <HomeAutomation />}
          </Container>
        </Box>
      </Flex>
    </Router>
  );
};

export default App;
