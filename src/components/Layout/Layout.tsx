import { HStack, Stack, Box } from "@chakra-ui/react";
import React from "react";
import { Navbar } from "../Navbar/Navbar";
import { SideBar } from "../SideBar/SideBar";
interface ClickableProps {
  children: JSX.Element[] | JSX.Element;
}

export default function Layout({ children }: ClickableProps): JSX.Element {
  const [toggel, setToggel] = React.useState(true);

  return (
    <Stack width={"100%"}>
      <Navbar onToggel={() => setToggel(!toggel)} />
      <HStack width={"100%"}>
        {toggel ? (
          <Box minHeight={window.innerHeight} borderRightWidth={1} width="20%">
            <SideBar />
          </Box>
        ) : (
          <React.Fragment />
        )}

        <Box
          minHeight={window.innerHeight}
          width={toggel ? "80%" : "100%"}
          bg={""}
        >
          {children}
        </Box>
      </HStack>
    </Stack>
  );
}
