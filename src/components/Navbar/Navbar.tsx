import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";

export interface State {
  onToggel: any;
}

export const Navbar = ({ onToggel }: State) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      borderBottom="solid 1px"
      borderBottomColor={useColorModeValue("gray.300", "gray.700")}
      px={5}
    >
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"lg"}
          icon={
            <HamburgerIcon
              boxSize={"2em"}
              alignContent="flex-start"
            ></HamburgerIcon>
          }
          aria-label={"menu"}
          onClick={onToggel}
        />
        <Text fontSize="3xl">Sunbird Community Engagement Dashboard</Text>

        <Flex>
          <IconButton
            aria-label="theme switcher"
            icon={colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            rounded="full"
            marginRight={2}
          />
        </Flex>
      </HStack>
    </Box>
  );
};
