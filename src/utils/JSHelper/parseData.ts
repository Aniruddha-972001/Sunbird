import moment from "moment";

// {
//   "Sunbird-RC": ["community"],
//   "project-sunbird": ["sunbird-community"],
//   "Sunbird-ed": ["Community"],
//   "Sunbird-Lern": ["Community"],
//   "Sunbird-Knowlg": ["Community"],
//   "Sunbird-inquiry": ["Community"]
// }
export default function parseData(
  timeFrame: string,
  data: any,
  tresult: any
): any {
  console.log("weekly==", data);
  let nodes = data["data"]["repository"]["discussions"]["nodes"];
  console.log(tresult);

  let result = tresult;
  if (timeFrame === "weekly") {
    for (let node of nodes) {
      let comments = node["comments"]["nodes"].length;
      const date = moment(node["createdAt"]);
      const weekNumber = date.week();
      const year = date.year();
      if (!result[`${year}-${weekNumber}`]) {
        result[`${year}-${weekNumber}`] = {};
      }
      const category = node["category"]["name"];
      if (!result[`${year}-${weekNumber}`][category]) {
        result[`${year}-${weekNumber}`][category] = {
          active: 0,
          answered: 0,
          unanswered: 0,
          total: 0,
        };
      }
      if (node["answer"]) {
        result[`${year}-${weekNumber}`][category].answered += 1;
        result[`${year}-${weekNumber}`][category].unanswered += 0;
        result[`${year}-${weekNumber}`][category].active += 0;
        result[`${year}-${weekNumber}`][category].total += 1;
      } else if (!node["answer"] && comments === 0) {
        result[`${year}-${weekNumber}`][category].answered += 0;
        result[`${year}-${weekNumber}`][category].unanswered += 1;
        result[`${year}-${weekNumber}`][category].active += 0;
        result[`${year}-${weekNumber}`][category].total += 1;
      } else {
        result[`${year}-${weekNumber}`][category].answered += 0;
        result[`${year}-${weekNumber}`][category].unanswered += 0;
        result[`${year}-${weekNumber}`][category].active += 1;
        result[`${year}-${weekNumber}`][category].total += 1;
      }
    }
  }
  if (timeFrame === "year") {
    for (let node of nodes) {
      let comments = node["comments"]["nodes"].length;
      let d = new Date();
      d.setMonth(d.getMonth() - 12);
      const date = moment(node["createdAt"]);

      if (date.isAfter(d) || date.isSame(d)) {
        if (!result["last 12 months"]) {
          result["last 12 months"] = {};
        }

        const category = node["category"]["name"];
        if (!result["last 12 months"][category]) {
          result["last 12 months"][category] = {
            active: 0,
            answered: 0,
            unanswered: 0,
            total: 0,
          };
        }
        //ACTIVE ----> DIVIDED INTO TWO THAT IS ANSWERED AND UNANSWERED
        //             IF DISCUSSION HAS AT LEAST ONE COMMENT THEN IT SHOULD BE ANSWERED (COMMENTS > 0)
        //             IF DISCUSSION HAS ANSWER ID IT IS ANSWERED (NODE['ANSWER']  EXISTS)
        //             IF BOTH CONDITIONS DONT SATISFY IT IS UNANSWERED (NODE['ANSWER'] DOESNT EXIST AND COMMENTS=0)

        if (node["answer"]) {
          result["last 12 months"][category].unanswered += 0;
          result["last 12 months"][category].active += 0;
          result["last 12 months"][category].total += 1;
          result["last 12 months"][category].answered += 1;
        } else if (!node["answer"] && comments === 0) {
          result["last 12 months"][category].answered += 0;
          result["last 12 months"][category].unanswered += 1;
          result["last 12 months"][category].active += 0;
          result["last 12 months"][category].total += 1;
        } else {
          result["last 12 months"][category].answered += 0;
          result["last 12 months"][category].unanswered += 0;
          result["last 12 months"][category].active += 1;
          result["last 12 months"][category].total += 1;
        }
      }
    }
  }

  return result;
}
