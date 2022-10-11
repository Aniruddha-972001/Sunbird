export default function summaryParse(
  name: string,
  owner: string,
  timeFrame: string,
  data: any,
  tresult: any
) {
  let projectName = owner;
  let nodes = data["data"]["repository"]["discussions"]["nodes"];
  let result = tresult;
  if (timeFrame === "summary") {
    for (let node of nodes) {
      let comments = node["comments"]["nodes"].length;
      if (!result[`${projectName}`]) {
        result[`${projectName}`] = {};
      }
      let repoName = name;
      if (!result[`${projectName}`][`${repoName}`]) {
        result[`${projectName}`][`${repoName}`] = {
          answered: 0,
          unanswered: 0,
          active: 0,
          total: 0,
        };
      }
      if (node["answer"]) {
        result[`${projectName}`][`${repoName}`].answered += 1;
        result[`${projectName}`][`${repoName}`].unanswered += 0;
        result[`${projectName}`][`${repoName}`].active += 0;
        result[`${projectName}`][`${repoName}`].total += 1;
      } else if (!node["answer"] && comments === 0) {
        result[`${projectName}`][`${repoName}`].answered += 0;
        result[`${projectName}`][`${repoName}`].unanswered += 1;
        result[`${projectName}`][`${repoName}`].active += 0;
        result[`${projectName}`][`${repoName}`].total += 1;
      } else {
        result[`${projectName}`][`${repoName}`].answered += 0;
        result[`${projectName}`][`${repoName}`].unanswered += 0;
        result[`${projectName}`][`${repoName}`].active += 1;
        result[`${projectName}`][`${repoName}`].total += 1;
      }
    }
  }

  return result;
}
