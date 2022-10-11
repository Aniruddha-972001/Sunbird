import React, { useEffect, useState } from "react";
import {
  Table,
  Box,
  Tbody,
  Tr,
  Td,
  TableContainer,
  HStack,
  Select,
} from "@chakra-ui/react";

import parseData from "../../utils/JSHelper/parseData";
import ownerRepoNames from "../../utils/Constant/ownerRepo.json";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import ChartData from "../../components/ChartData/ChartData";
const apiEndpoint = "https://api.github.com/graphql";
const token = process.env.REACT_APP_GITHUB_ACCESS_KEY;
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

let pieData: any = {};
let agingData: any = {};
let pieDataTotal: any = {};
let activeValue: any;
let answerValue: any;
let unAnsweredValue: any;

function Year({ timeFrame }: { timeFrame: string }, props: any) {
  const params: any = useParams();
  const [owner, setOwner] = useState("Sunbird-RC");
  const [name, setName] = useState("community");
  const [parsedResult, setParsedData] = useState<any>();
  const [selectedMonth, setselectedMonth] = useState("");
  const [monthlyCategories, setmonthlyCategories] = useState<string[]>();
  const navigate = useNavigate();
  useEffect(() => {
    const getData = async () => {
      if (params.owner && params.name) {
        setOwner(params.owner);
        setName(params.name);
        await runQuery1();
      }
    };
    getData();
  });

  const runQuery1 = async () => {
    let queryData: any;
    let cursorId: any;

    if (!owner || owner === "") {
      return;
    }

    if (!name || name === "") {
      return;
    }
    console.log("owner===", owner);
    console.log("name==", name);
    let _result: any = {};
    let response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: buildQuery(owner, name) }),
    });
    let responseJSON = await response.json();
    _result = await parseData(timeFrame, responseJSON, {});

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
      _result = await parseData(timeFrame, responseJSON, _result);
      queryData = responseJSON["data"]["repository"]["discussions"]["edges"];
      cursorId = queryData[queryData.length - 1];
    }
    setParsedData(_result);
    if (timeFrame === "year") {
      setselectedMonth("last 12 months");

      setmonthlyCategories(Object.keys(_result["last 12 months"]));

      for (let i in _result) {
        pieData = {
          ...pieData,
          [i]: [
            ["Task", "Hours per Day"],
            ...Object.keys(_result[i]).map((val, key) => {
              return [val, _result[i][val].total];
            }),
          ],
        };
      }

      for (let i in _result) {
        let resultValues = Object.values(_result["last 12 months"]);
        pieDataTotal = {
          ...pieDataTotal,
          [i]: [
            ["Task", "Hours per Day"],
            ...Object.keys(_result[i]).map((val, key) => {
              return [val, _result[i][val].active];
            }),
          ],
        };

        activeValue = [
          "Active",
          resultValues
            .map((Eval: any, i) => {
              return Eval.active;
            })
            .reduce(function (a, b) {
              return a + b;
            }, 0),
        ];

        answerValue = [
          "Answered",
          resultValues
            .map((Eval: any, i) => {
              return Eval.answered;
            })
            .reduce(function (a, b) {
              return a + b;
            }, 0),
        ];

        unAnsweredValue = [
          "Unanswered",
          resultValues
            .map((Eval: any, i) => {
              return Eval.unanswered;
            })
            .reduce(function (a, b) {
              return a + b;
            }, 0),
        ];

        agingData = {
          ...agingData,
          [i]: [
            ["Task", "Hours per Day"],
            [...activeValue],
            [...answerValue],
            [...unAnsweredValue],
          ],
        };
      }
    }
  };

  const setSubmit = (e: any) => {
    setOwner(e.target.value);
    setName(e.target.value.split("/")[1]);
    let subName;
    if (timeFrame === "year") {
      subName = ownerRepoNames
        .filter((value) => value.ownerName === owner)[0]
        ["ownerRepos"].map((val) => {
          return val;
        })
        .toString();
      setName(subName);
      navigate(
        `/summary/year/${e.target.value}/${subName}
        `
      );
      runQuery1();
    } else {
      setOwner(e.target.value);
      setName(e.target.value.split("/")[1]);

      runQuery1();
    }
  };

  const selectMonth = (e: any) => {
    setselectedMonth(e.target.value);
    setmonthlyCategories(Object.keys(parsedResult[e.target.value]));
  };

  let options = [<option value="None">None</option>];
  if (parsedResult) {
    options = Object.keys(parsedResult).map((key, index) => {
      return (
        <option key={index} value={key}>
          {key}
        </option>
      );
    });
  }

  let table = <table></table>;
  if (selectedMonth && selectedMonth !== "" && monthlyCategories) {
    table = (
      <TableContainer>
        <Table variant="striped">
          <Tbody>
            <Tr fontWeight={"bold"}>
              <Td>Category</Td>
              <Td>Active</Td>
              <Td>Answered</Td>
              <Td>Unanswered</Td>
              <Td>Total</Td>
            </Tr>
            {monthlyCategories !== null &&
              monthlyCategories.map((name, index) => {
                return (
                  <Tr key={index}>
                    <Td>{name}</Td>
                    <Td>{parsedResult[selectedMonth][name].active}</Td>
                    <Td>{parsedResult[selectedMonth][name].answered}</Td>
                    <Td>{parsedResult[selectedMonth][name].unanswered}</Td>
                    <Td>{parsedResult[selectedMonth][name].total}</Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <div>
      <Layout>
        <Box py={5} width={"80%"} pl={"50px"}>
          <HStack>
            <Select
              variant="outline"
              size="sm"
              width={"50%"}
              onChange={(e) => {
                setSubmit(e);
                console.log(e.target.value);
              }}
            >
              <option value="None">Select Option</option>
              {ownerRepoNames.map((value, index) => {
                return (
                  <option
                    key={index}
                    value={value.ownerName}
                    {...(params.owner && params.owner === value.ownerName
                      ? { selected: true }
                      : {})}
                  >
                    {value.ownerName} /{" "}
                    {ownerRepoNames
                      .filter((value) => value.ownerName === owner)[0]
                      ["ownerRepos"].map((val) => {
                        return val;
                      })}
                  </option>
                );
              })}
            </Select>

            {timeFrame === "year" ? null : (
              <Select
                variant="outline"
                size="sm"
                width={"35%"}
                name="month"
                id="month"
                onChange={selectMonth}
              >
                {options}
              </Select>
            )}
          </HStack>
          <Box pt={"40px"}>{table}</Box>
          {selectedMonth && selectedMonth !== "" && monthlyCategories ? (
            <ChartData categorydata={pieData} agingdata={agingData} />
          ) : null}
        </Box>
      </Layout>
    </div>
  );
}

export default Year;
