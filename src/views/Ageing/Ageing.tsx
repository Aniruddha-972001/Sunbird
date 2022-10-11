import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ownerRepoNames from "../../utils/Constant/ownerRepo.json";
import {
  Table,
  Box,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Select,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import Layout from "../../components/Layout/Layout";
import ChartData from "../../components/ChartData/ChartData";
import parseAgeing from "./ParseAgeing";
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

let pieData: any = [];
let agingData: any = {};
let activeValue: any;
let answerValue: any;
let unAnsweredValue: any;

function Ageing({ timeFrame }: { timeFrame: string }) {
  const params: any = useParams();
  const [owner, setOwner] = useState(
    params.owner ? params.owner : "Sunbird-RC"
  );
  const [name] = useState(params.name ? params.name : "community");
  const [parsedData, setParsedData] = useState<any>();
  const [monthlyCategories, setmonthlyCategories] = useState<string[]>();
  const [tableShow, setTableShow] = useState(false);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (owner && name) {
      setFlag(true);

      runQuery1(owner, name);
    }
  }, [owner, name]);

  const runQuery1 = async (
    owner: string | undefined,
    name: string | undefined
  ) => {
    let queryData: any;
    let cursorId: any;
    if (owner && name) {
      setFlag(true);
      setOwner(owner);
    }
    if (!owner || owner === "") {
      console.error("Owner not set.");
      return;
    }

    if (!name || name === "") {
      console.error("Name not set.");
      return;
    }
    let parseResult: any = {};
    let response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: buildQuery(owner, name) }),
    });

    let responseJSON = await response.json();

    await parseAgeing(timeFrame, responseJSON, parseResult);
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
      await parseAgeing(timeFrame, responseJSON, parseResult);

      queryData = responseJSON["data"]["repository"]["discussions"]["edges"];
      cursorId = queryData[queryData.length - 1];
    }

    setParsedData(parseResult);
    setmonthlyCategories(Object.keys(parseResult));
    setTableShow(true);

    for (let i in parseResult) {
      let arrData = [
        i,
        ...Object.keys(parseResult[i]).map((val) => {
          return parseResult[i]["active"] || parseResult[i]["unanswered"]
            ? parseResult[i][val].total
            : 0;
        }),
      ];

      if (arrData.length < 3) {
        arrData = [1, 2, 3].map((e, index) => {
          return arrData[index] ? arrData[index] : 0;
        });
      }
      pieData.push(arrData);

      let resultValues = Object.values(parseResult);
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

    // ====barchart for active/unanswered by ranges===========

    let rangeArr = ["0-15", "15-30", "30-60", "60-90", "90-365", "365+"];
    let keysMain = Object.keys(parseResult);
    for (let i = 0; i < keysMain.length; i++) {
      for (const element of rangeArr) {
        let barChart2 = [
          rangeArr[i],
          parseResult[keysMain[i]]["active"] === undefined
            ? 0
            : parseResult[keysMain[i]]["active"][element],
          parseResult[keysMain[i]]["unanswered"] === undefined
            ? 0
            : parseResult[keysMain[i]]["unanswered"][element],
        ];

        if (barChart2.length < keysMain.length - 1) {
          barChart2 = [1, 2, 3].map((e, index) => {
            return barChart2[index] ? barChart2[index] : 0;
          });
        }

        break;
      }
    }
  };

  let barArr = [["category", "Active", "Unanswer"], ...pieData];

  const setSubmit = (e: any) => {
    if (owner && name) {
      runQuery1(owner, name);
    } else {
      setOwner(e.target.value.split("/")[0]);
      navigate(
        `/summary/ageing/${e.target.value}
        `
      );

      runQuery1(e.target.value.split("/")[0], e.target.value.split("/")[1]);
    }
  };
  const setSelectValue = (val: any) => {
    setOwner(val.target.value.split("/")[0]);
    navigate(
      `/summary/ageing/${val.target.value.split("/")[0]}/${
        val.target.value.split("/")[1]
      }`
    );
    runQuery1(val.target.value.split("/")[0], val.target.value.split("/")[1]);
  };
  let ageingTable;
  ageingTable = (
    <TableContainer>
      <Table variant="striped">
        <Tbody>
          <Tr>
            <Th textAlign="center">Category</Th>
            <Th textAlign="center" colSpan={7}>
              Ageing (Days)
            </Th>
          </Tr>
          <Tr>
            <Th></Th>
            <Th>0-15 </Th>
            <Th>15-30 </Th>
            <Th>30-60 </Th>
            <Th>60-90 </Th>
            <Th>90-360 </Th>
            <Th>360+ </Th>
            <Th>Total </Th>
          </Tr>
          {monthlyCategories?.map((name, index) => {
            return (
              <>
                <Tr key={index}>
                  <Td>{[name]}</Td>
                  <Tooltip label="Active/Unanswered">
                    <Td>{`${
                      parsedData[name].active
                        ? parsedData[name].active["0-15"]
                        : 0
                    }/${
                      parsedData[name].unanswered
                        ? parsedData[name].unanswered["0-15"]
                        : 0
                    }`}</Td>
                  </Tooltip>
                  <Tooltip label="Active/Unanswered">
                    <Td>{`${
                      parsedData[name].active
                        ? parsedData[name].active["15-30"]
                        : 0
                    }/${
                      parsedData[name].unanswered
                        ? parsedData[name].unanswered["15-30"]
                        : 0
                    }`}</Td>
                  </Tooltip>
                  <Tooltip label="Active/Unanswered">
                    <Td>{`${
                      parsedData[name].active
                        ? parsedData[name].active["30-60"]
                        : 0
                    }/${
                      parsedData[name].unanswered
                        ? parsedData[name].unanswered["30-60"]
                        : 0
                    }`}</Td>
                  </Tooltip>
                  <Tooltip label="Active/Unanswered">
                    <Td>{`${
                      parsedData[name].active
                        ? parsedData[name].active["60-90"]
                        : 0
                    }/${
                      parsedData[name].unanswered
                        ? parsedData[name].unanswered["60-90"]
                        : 0
                    }`}</Td>
                  </Tooltip>
                  <Tooltip label="Active/Unanswered">
                    <Td>{`${
                      parsedData[name].active
                        ? parsedData[name].active["90-365"]
                        : 0
                    }/${
                      parsedData[name].unanswered
                        ? parsedData[name].unanswered["90-365"]
                        : 0
                    }`}</Td>
                  </Tooltip>
                  <Tooltip label="Active/Unanswered">
                    <Td>{`${
                      parsedData[name].active
                        ? parsedData[name].active["365+"]
                        : 0
                    }/${
                      parsedData[name].unanswered
                        ? parsedData[name].unanswered["365+"]
                        : 0
                    }`}</Td>
                  </Tooltip>
                  <Tooltip label="Active/Unanswered">
                    <Td>{`${
                      parsedData[name].active
                        ? parsedData[name].active["total"]
                        : 0
                    }/${
                      parsedData[name].unanswered
                        ? parsedData[name].unanswered["total"]
                        : 0
                    }`}</Td>
                  </Tooltip>
                </Tr>
              </>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );

  return (
    <Layout>
      <Box pl={"50px"} minHeight={window.innerHeight}>
        <HStack>
          {flag === true ? (
            <Select
              variant="outline"
              size="sm"
              width={"50%"}
              name="month"
              id="month"
              onChange={(e) => {
                setSelectValue(e);
              }}
            >
              {ownerRepoNames.map((value, index) => {
                return (
                  <option
                    key={index}
                    value={
                      value.ownerName +
                      "/" +
                      value["ownerRepos"].map((data) => {
                        return data;
                      })
                    }
                  >
                    {value.ownerName} /{" "}
                    {value["ownerRepos"].map((data) => {
                      return data;
                    })}
                  </option>
                );
              })}
            </Select>
          ) : (
            <Select
              variant="outline"
              size="sm"
              width={"50%"}
              name="month"
              id="month"
              value={owner + "/" + name}
              onChange={(e) => {
                setSubmit(e);
              }}
            >
              <option value="None">Select Option</option>
              {ownerRepoNames.map((value, index) => {
                return (
                  <option
                    key={index}
                    value={
                      value.ownerName +
                      "/" +
                      ownerRepoNames
                        .filter((value) => value.ownerName === owner)[0]
                        ["ownerRepos"].map((val) => {
                          return val;
                        })
                    }
                    // {...(owner && owner === value.ownerName
                    //   ? { selected: true }
                    //   : {})}
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
          )}
        </HStack>
        <VStack pt={"25px"}>{tableShow ? ageingTable : null}</VStack>
        {tableShow && (
          <ChartData
            categorydata={barArr}
            agingdata={agingData}
            charttype="bar"
          />
        )}
      </Box>
    </Layout>
  );
}
export default Ageing;
