import request from "supertest";
import {
  clearDatabase,
  closeDatabase,
  connect,
} from "../../src/utils/db-handler";
import server from "../../src/server";
beforeAll(async () => await connect());
afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});
describe("Populate Database", () => {
  test("Should response ok", async () => {
    await request(server.app)
      .get("/iati/init")
      .expect("Content-Type", /json/)
      .expect(200);
  })
  test("Should response error", async()=>{
   const {body} =await request(server.app)
      .get("/iati/activities")
      .expect("Content-Type", /json/)
      .expect(400);
      expect(body.details).toMatchObject([{"context": {"key": "year", "label": "year"}, "message": "\"year\" is required", "path": ["year"], "type": "any.required"}])
  })
  test("Should response Data", async()=>{
   const {body} =await request(server.app)
      .get("/iati/activities?year=2018")
      .expect("Content-Type", /json/)
      .expect(200);
      expect(body).toHaveLength(5)
  })

})