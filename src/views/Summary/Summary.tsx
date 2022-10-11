import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Spinner,
  Center,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useState } from "react";
import Chart from "react-google-charts";
import Layout from "../../components/Layout/Layout";
import ownerRepoNames from "../../utils/Constant/ownerRepo.json";
import summaryParseData from "./ParseSmmary";

const apiEndpoint = "https://api.github.com/graphql";
const token = process.env.REACT_APP_GITHUB_ACCESS_KEY;

let owner: string;
let name: string;
const buildQuery = (owner: string, name: string) => `
{
  repository(owner: "${owner}", name: "${name}") {
    discussions(first: 100 ,orderBy: {field: CREATED_AT, direction: DESC}) {
      edges {
        cursor
      }
      nodes {
        createdAt
        category {
          name
        }
        answer{
          id
        }
        comments(first: 100) {
          nodes {
            publishedAt
          }
        }
      }
    }  
  }
}
`;

const buildQuery1 = (owner: string, name: string, cursorId: string) => `
{
  repository(owner: "${owner}", name: "${name}") {
    discussions(first: 100 ,after:"${cursorId}",orderBy: {field: CREATED_AT, direction: DESC}) {
      edges {
        cursor
      }
      nodes {
        createdAt
        category {
          name
        }
        answer{
          id
        }
        comments(first: 100) {
          nodes {
            publishedAt
          }
        }
      }
    }  
  }
}
`;

function Summary({ timeFrame }: { timeFrame: string }): any {
  let [tableData, setTableData] = useState<any[]>();
  let _result: any = {};
  let pieData: any = [];
  let agingData: any = [];
  let activeValue: any;
  let answerValue: any;
  let unAnsweredValue: any;

  const summaryRun = async () => {
    let overallResults = [];
    for (let i = 0; i < ownerRepoNames.length; i++) {
      let queryData: any;
      let cursorId: any;
      owner = ownerRepoNames[`${i}`].ownerName;
      name = ownerRepoNames[`${i}`].ownerRepos[0];
      let response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: buildQuery(owner, name) }),
      });
      let responseJSON = await response.json();
      _result = await summaryParseData(
        name,
        owner,
        timeFrame,
        responseJSON,
        {}
      );
      localStorage.setItem("DATA", JSON.stringify(responseJSON));

      queryData = responseJSON["data"]["repository"]["discussions"]["edges"];
      cursorId = queryData[queryData.length - 1];

      while (queryData.length === 100) {
        response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: buildQuery1(owner, name, cursorId.cursor),
          }),
        });

        responseJSON = await response.json();
        _result = await summaryParseData(
          name,
          owner,
          timeFrame,
          responseJSON,
          _result
        );
        queryData = responseJSON["data"]["repository"]["discussions"]["edges"];

        cursorId = queryData[queryData.length - 1];
      }

      overallResults.push(_result);
      console.log(cursorId);
    }

    console.log("Done!");

    setTableData(overallResults);
    // Code for Piechart----------------------------------------
  };

  let res: any;
  let agingArr: any;
  let activeCount: number = 0;
  let answeredCount: number = 0;
  let unansweredCount: number = 0;

  res =
    tableData &&
    tableData.map((proj) => {
      return (
        (activeValue = [
          "Active",
          activeCount +
            proj[Object.keys(proj)[0]][
              Object.keys(proj[Object.keys(proj)[0]])[0]
            ].active,
        ]),
        (answerValue = [
          "Answered",
          answeredCount +
            proj[Object.keys(proj)[0]][
              Object.keys(proj[Object.keys(proj)[0]])[0]
            ].answered,
        ]),
        (unAnsweredValue = [
          "Unanswered",
          unansweredCount +
            proj[Object.keys(proj)[0]][
              Object.keys(proj[Object.keys(proj)[0]])[0]
            ].unanswered,
        ])
      );
    });

  agingArr =
    tableData &&
    tableData.map((proj) => {
      return [
        Object.keys(proj)[0],
        proj[Object.keys(proj)[0]][Object.keys(proj[Object.keys(proj)[0]])[0]]
          .total,
      ];
    });

  if (res) {
    pieData.push(
      ["Task", "Hours per Day"],

      [...activeValue],
      [...answerValue],
      [...unAnsweredValue]
    );
  }

  if (agingArr) {
    agingData.push(["Community", "Total"], ...agingArr);
  }

  if (!tableData) summaryRun();

  let table;
  table = (
    <TableContainer>
      <Table variant="striped">
        <Tbody>
          <Tr fontWeight={"bold"}>
            <Td>Project Name</Td>
            <Td>Active</Td>
            <Td>Answered</Td>
            <Td>Unanswered</Td>
            <Td>Total</Td>
          </Tr>
          {tableData &&
            tableData.map((proj, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    {/* <a
                      href={`/summary/year/${Object.keys(proj)[0]}/${
                        Object.keys(proj[`${Object.keys(proj)[0]}`])[0]
                      }`}
                    >
                      {`${Object.keys(proj)[0]}/${
                        Object.keys(proj[`${Object.keys(proj)[0]}`])[0]
                      }`}
                    </a> */}
                    <Link
                      to={`/summary/year/${Object.keys(proj)[0]}/${
                        Object.keys(proj[`${Object.keys(proj)[0]}`])[0]
                      }`}
                    >
                      {`${Object.keys(proj)[0]}/${
                        Object.keys(proj[`${Object.keys(proj)[0]}`])[0]
                      }`}
                    </Link>
                  </Td>
                  <Td>
                    {
                      proj[`${Object.keys(proj)[0]}`][
                        Object.keys(proj[Object.keys(proj)[0]])[0]
                      ].active
                    }
                  </Td>
                  <Td>
                    {
                      proj[`${Object.keys(proj)[0]}`][
                        Object.keys(proj[Object.keys(proj)[0]])[0]
                      ].answered
                    }
                  </Td>
                  <Td>
                    {
                      proj[`${Object.keys(proj)[0]}`][
                        Object.keys(proj[Object.keys(proj)[0]])[0]
                      ].unanswered
                    }
                  </Td>
                  <Td>
                    {
                      proj[`${Object.keys(proj)[0]}`][
                        Object.keys(proj[Object.keys(proj)[0]])[0]
                      ].total
                    }
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </TableContainer>
  );

  return (
    <Layout>
      <Box>
        <button onClick={summaryRun}></button>
        <Box py={5} pl={"50px"}>
          {tableData ? (
            table
          ) : (
            <Center h="100px" color="blue">
              <Spinner size="xl" />
            </Center>
          )}
          {tableData && (
            <HStack width={"70%"} position={"absolute"}>
              <Chart
                chartType="PieChart"
                data={agingData}
                // options={options}
                width={"100%"}
                height={"400px"}
              />
              <Chart
                chartType="PieChart"
                data={pieData}
                // options={options}
                width={"100%"}
                height={"400px"}
              />
            </HStack>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
export default Summary;
