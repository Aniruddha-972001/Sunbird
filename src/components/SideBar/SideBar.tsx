import React from "react";
import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { Accordion, AccordionItem, AccordionButton } from "@chakra-ui/react";

export function SideBar(props: any, { onOpen, onClose }: any) {
  return (
    <Box pr="4">
      <Accordion allowToggle borderColor={"white"}>
        <AccordionItem py={"2"}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Link to="/summary">Summary page</Link>
              </Box>
            </AccordionButton>
          </h2>
        </AccordionItem>
        <AccordionItem py={"2"}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Link to="/summary/year">Summary Year page</Link>
              </Box>
            </AccordionButton>
          </h2>
        </AccordionItem>

        <AccordionItem py={"2"}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Link to="/summary/weekly">Summary Week page</Link>
              </Box>
            </AccordionButton>
          </h2>
        </AccordionItem>

        <AccordionItem py={"2"}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Link to="/summary/ageing">Summary Ageing page</Link>
              </Box>
            </AccordionButton>
          </h2>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
