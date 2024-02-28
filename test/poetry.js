import { expect } from "chai";

import { get_random_uid, parse_uid, get_poetry_data_by_uid, get_better_msg } from "../dist/index.js";

describe("test get_random_uid", () => {
  it("should return a random number as string", () => {
    expect(get_random_uid()).to.be.a("string");
  });
});

describe("test parse_uid", () => {
  it("should return a Object", () => {
    expect(parse_uid("32277")).to.be.an("object");
  });
  it("check object property", () => {
    let uid = get_random_uid();
    let paresd = parse_uid(uid);
    expect(paresd).to.have.property("uid").to.be.a("string");
    expect(paresd).to.have.property("type").to.be.a("number");
    expect(paresd).to.have.property("id").to.be.a("number");
    expect(paresd).to.have.property("type_string").to.be.oneOf(["tang", "song", "ci"]);
    expect(paresd).to.have.property("collection").to.be.oneOf(["全唐诗", "全宋诗", "全宋词"]);
    expect(paresd).to.have.property("poetry_time").to.oneOf(["唐", "宋"]);
  });
});

describe("get a random poetry msg", async () => {
  for (let i = 0; i < 20; i++) {
    let data = await get_better_msg();
    console.log(`${i + 1}:`, data.msg);
  }
});
