import moment from "moment";

export default function parseAgeing(
  timeFrame: string,
  data: any,
  tresult: any
): any {
  let AgeingCount = tresult;
  let nodes = data["data"]["repository"]["discussions"]["nodes"];

  if (timeFrame === "ageing") {
    for (let node of nodes) {
      let comments = node["comments"]["nodes"].length;
      let cat = node["category"]["name"];
      const date = moment(node["createdAt"]);
      let todayDate = new Date();
      let diff = Math.abs(date.diff(todayDate, "days"));

      if (!AgeingCount[cat]) {
        AgeingCount[cat] = {};
      }

      if (node["answer"]) {
        continue;
      } else if (!node["answer"] && comments === 0) {
        if (!AgeingCount[cat].unanswered) {
          AgeingCount[cat].unanswered = {
            "0-15": 0,
            "15-30": 0,
            "30-60": 0,
            "60-90": 0,
            "90-365": 0,
            "365+": 0,
            total: 0,
          };
        }
        if (diff < 15 && diff > 0) {
          AgeingCount[cat].unanswered["0-15"] += 1;
          AgeingCount[cat].unanswered["15-30"] += 0;
          AgeingCount[cat].unanswered["30-60"] += 0;
          AgeingCount[cat].unanswered["60-90"] += 0;
          AgeingCount[cat].unanswered["90-365"] += 0;
          AgeingCount[cat].unanswered["365+"] += 0;
          AgeingCount[cat].unanswered.total += 1;
        } else if (diff >= 15 && diff < 30) {
          AgeingCount[cat].unanswered["0-15"] += 0;
          AgeingCount[cat].unanswered["15-30"] += 1;
          AgeingCount[cat].unanswered["30-60"] += 0;
          AgeingCount[cat].unanswered["60-90"] += 0;
          AgeingCount[cat].unanswered["90-365"] += 0;
          AgeingCount[cat].unanswered["365+"] += 0;
          AgeingCount[cat].unanswered.total += 1;
        } else if (diff >= 30 && diff < 60) {
          AgeingCount[cat].unanswered["0-15"] += 0;
          AgeingCount[cat].unanswered["15-30"] += 0;
          AgeingCount[cat].unanswered["30-60"] += 1;
          AgeingCount[cat].unanswered["60-90"] += 0;
          AgeingCount[cat].unanswered["90-365"] += 0;
          AgeingCount[cat].unanswered["365+"] += 0;
          AgeingCount[cat].unanswered.total += 1;
        } else if (diff >= 60 && diff < 90) {
          AgeingCount[cat].unanswered["0-15"] += 0;
          AgeingCount[cat].unanswered["15-30"] += 0;
          AgeingCount[cat].unanswered["30-60"] += 0;
          AgeingCount[cat].unanswered["60-90"] += 1;
          AgeingCount[cat].unanswered["90-365"] += 0;
          AgeingCount[cat].unanswered["365+"] += 0;
          AgeingCount[cat].unanswered.total += 1;
        } else if (diff >= 90 && diff < 360) {
          AgeingCount[cat].unanswered["0-15"] += 0;
          AgeingCount[cat].unanswered["15-30"] += 0;
          AgeingCount[cat].unanswered["30-60"] += 0;
          AgeingCount[cat].unanswered["60-90"] += 0;
          AgeingCount[cat].unanswered["90-365"] += 1;
          AgeingCount[cat].unanswered["365+"] += 0;
          AgeingCount[cat].unanswered.total += 1;
        } else {
          AgeingCount[cat].unanswered["0-15"] += 0;
          AgeingCount[cat].unanswered["15-30"] += 0;
          AgeingCount[cat].unanswered["30-60"] += 0;
          AgeingCount[cat].unanswered["60-90"] += 0;
          AgeingCount[cat].unanswered["90-365"] += 0;
          AgeingCount[cat].unanswered["365+"] += 1;
          AgeingCount[cat].unanswered.total += 1;
        }
      } else {
        if (!AgeingCount[cat].active) {
          AgeingCount[cat].active = {
            "0-15": 0,
            "15-30": 0,
            "30-60": 0,
            "60-90": 0,
            "90-365": 0,
            "365+": 0,
            total: 0,
          };
        }
        if (diff < 15 && diff > 0) {
          AgeingCount[cat].active["0-15"] += 1;
          AgeingCount[cat].active["15-30"] += 0;
          AgeingCount[cat].active["30-60"] += 0;
          AgeingCount[cat].active["60-90"] += 0;
          AgeingCount[cat].active["90-365"] += 0;
          AgeingCount[cat].active["365+"] += 0;
          AgeingCount[cat].active.total += 1;
        } else if (diff >= 15 && diff < 30) {
          AgeingCount[cat].active["0-15"] += 0;
          AgeingCount[cat].active["15-30"] += 1;
          AgeingCount[cat].active["30-60"] += 0;
          AgeingCount[cat].active["60-90"] += 0;
          AgeingCount[cat].active["90-365"] += 0;
          AgeingCount[cat].active["365+"] += 0;
          AgeingCount[cat].active.total += 1;
        } else if (diff >= 30 && diff < 60) {
          AgeingCount[cat].active["0-15"] += 0;
          AgeingCount[cat].active["15-30"] += 0;
          AgeingCount[cat].active["30-60"] += 1;
          AgeingCount[cat].active["60-90"] += 0;
          AgeingCount[cat].active["90-365"] += 0;
          AgeingCount[cat].active["365+"] += 0;
          AgeingCount[cat].active.total += 1;
        } else if (diff >= 60 && diff < 90) {
          AgeingCount[cat].active["0-15"] += 0;
          AgeingCount[cat].active["15-30"] += 0;
          AgeingCount[cat].active["30-60"] += 0;
          AgeingCount[cat].active["60-90"] += 1;
          AgeingCount[cat].active["90-365"] += 0;
          AgeingCount[cat].active["365+"] += 0;
          AgeingCount[cat].active.total += 1;
        } else if (diff >= 90 && diff < 360) {
          AgeingCount[cat].active["0-15"] += 0;
          AgeingCount[cat].active["15-30"] += 0;
          AgeingCount[cat].active["30-60"] += 0;
          AgeingCount[cat].active["60-90"] += 0;
          AgeingCount[cat].active["90-365"] += 1;
          AgeingCount[cat].active["365+"] += 0;
          AgeingCount[cat].active.total += 1;
        } else {
          AgeingCount[cat].active["0-15"] += 0;
          AgeingCount[cat].active["15-30"] += 0;
          AgeingCount[cat].active["30-60"] += 0;
          AgeingCount[cat].active["60-90"] += 0;
          AgeingCount[cat].active["90-365"] += 0;
          AgeingCount[cat].active["365+"] += 1;
          AgeingCount[cat].active.total += 1;
        }
      }
    }
  }
  console.log(AgeingCount);
}
