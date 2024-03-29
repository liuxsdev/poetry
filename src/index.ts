import { random, random_pick_by_wight } from "@liuxsdev/utils";
import axios, { AxiosRequestConfig } from "axios";

//随机uid
function get_random_uid(): string {
  // 1：全唐诗 57611
  // 2：全宋诗 254247
  // 3：全宋词 21052
  var random_type = random_pick_by_wight([1, 2, 3], [12, 25, 20]);
  switch (random_type) {
    case 1:
      return `${random_type}${random(1, 57611)}`;
    case 2:
      return `${random_type}${random(1, 254247)}`;
    case 3:
      return `${random_type}${random(1, 21052)}`;
    default:
      return "37227";
  }
}

//uid解析
function parse_uid(uid: string) {
  var len = uid.length;
  var type = parseInt(uid[0]);
  var type_string = ["", "tang", "song", "ci"][type];
  var collection = ["", "全唐诗", "全宋诗", "全宋词"][type];
  var poetry_time = ["", "唐", "宋", "宋"][type];
  var id = parseInt(uid.slice(1, len));
  return {
    uid,
    type,
    id,
    type_string,
    collection,
    poetry_time,
  };
}
const paramsSerializer = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const paramValue = params[key];
      if (typeof paramValue === "object") {
        // 如果是对象，使用 JSON.stringify 进行序列化
        queryParams.append(key, JSON.stringify(paramValue));
      } else {
        queryParams.append(key, paramValue);
      }
    }
  }

  return queryParams.toString();
};
//获取数据
async function get_poetry(type: string, id: number) {
  const url = "https://5mygktml.lc-cn-n1-shared.com/1.1/classes/" + type;
  const headers = {
    "X-LC-Id": "5MygktMLnx3hhFTZ6TMhB6SR-gzGzoHsz",
    "X-LC-Key": "Bx7ZMmyWsGVp15RoICI7LDXr",
    "Content-Type": "application/json",
  };
  const axios_config: AxiosRequestConfig = {
    method: "get",
    url,
    headers,
    params: {
      where: { id },
    },
    paramsSerializer, // 使用自定义的参数序列化方法
  };
  return await axios(axios_config);
}

//uid->数据
async function get_poetry_data_by_uid(uid: string) {
  const extra = parse_uid(uid);
  const data = await get_poetry(extra.type_string, extra.id);
  const poetry_data = data["data"]["results"][0];
  return { extra, poetry_data };
}
//随机uid->数据
async function get_random_poetry() {
  let random_uid = get_random_uid();
  return get_poetry_data_by_uid(random_uid);
}

//检查诗句
function check_msg(msg: string) {
  if (msg.includes("□") || msg.includes("《") || msg.includes("「") || msg.length <= 5) {
    return false;
  }
  return true;
}

//随机诗句mgs
async function get_random_poetry_msg() {
  let { extra, poetry_data } = await get_random_poetry();
  let paras = poetry_data["paragraphs"];
  let paras_len = paras.map((item: any) => item.length);
  let title = poetry_data["title"] || poetry_data["rhythmic"];
  if (title.length >= 25) {
    console.log(title);
    title = title.slice(0, 25) + "...";
  }
  let random_select_para = random_pick_by_wight(paras, paras_len);
  let msg = `${random_select_para}——﹝${extra.poetry_time}﹞${poetry_data.author} 《${title}》`;
  let checked = check_msg(random_select_para);
  return { msg, checked, extra, poetry_data };
}
//
async function get_better_msg() {
  let msg_data = await get_random_poetry_msg();
  while (msg_data.checked == false) {
    console.log("bad", msg_data);
    msg_data = await get_random_poetry_msg();
  }
  return msg_data;
}

export { get_random_uid, parse_uid, get_poetry_data_by_uid, get_random_poetry_msg, get_better_msg };
