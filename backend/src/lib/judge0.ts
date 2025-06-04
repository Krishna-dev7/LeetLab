import axios from "axios";
import env from "../env";

type Languages = "java" | "python" | "javascript";
type SubmissionType = {
  source_code: string,
  language_id: number,
  stdin: string,
  expected_output: string
}


function getLanguageId(language: Languages): number {

  const languageMap: Record<Languages, number> = {
    java: 62,
    python: 71,
    javascript: 63
  }

  return languageMap[language];
}


async function submitBatch(submissions: SubmissionType[]) {

  const res = await axios.post(
    `${env.JUDGE0_URL}/submissions/batch?base64_encoded=false`, 
    {submissions},
    {headers: {
        "Content-Type": "application/json"
    }});

  return res.data;
}


const sleep = (ms: number) => 
  new Promise((resolve) => setTimeout(resolve, ms));

async function pollBatchResults(tokens: string[]) {
  while(true) {

    const url = `${env.JUDGE0_URL}/submissions/batch`;
    const tokenParam = tokens.join(",");

    const res = await axios.get(
      url,
      { params: {tokens: tokenParam}}
    )

    const results: Array<any> 
      = res.data.submissions;

    const isAllDone = results
      .every(
        (r) => (r.status.id !== 1 && r.status.id !== 2) 
      )

    if(isAllDone) return results;
    await sleep(1000);
  }
}



export default getLanguageId;
export {
  submitBatch,
  pollBatchResults
}

export type {
  Languages,
  SubmissionType
}