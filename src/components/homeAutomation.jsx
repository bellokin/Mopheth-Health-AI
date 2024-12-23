import React, { useState } from 'react';
import { Box, Button, HStack, VStack, Text, Container } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';


const HomeAutomation = () => {
  return (
    <Box>
      <Text fontSize="2xl" color="blue.600" fontWeight="bold">
        Home Automation Interface (Coming soon)
      </Text>
      {/* Placeholder for Home Automation features */}
    </Box>
  );
};

export default HomeAutomation;