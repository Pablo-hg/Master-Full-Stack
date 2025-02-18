// Import necessary libraries
const request = require("supertest");
const { app, server } = require("./app"); // Adjust the path to where your Express app is exported

describe("GET /tasks endpoint", () => {
  test("should return a 200 status code and a JSON array of incomplete tasks", async () => {
    await request(app)
      .get("/tasks")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        console.log("response", response.body);
        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((task) => {
          expect(task).toHaveProperty("id");
          expect(task).toHaveProperty("title");
          expect(task).toHaveProperty("description");
          expect(task).toHaveProperty("status");
          expect(task.status).not.toBe("DONE"); // Assuming "DONE" tasks are not included in the response
          expect(task).toHaveProperty("dueDate");
          expect(task).toHaveProperty("user");
          expect(task).toHaveProperty("createdAt");
          expect(task).toHaveProperty("modifiedAt");
          // 'deletedAt' might not be relevant here as we are fetching incomplete (active) tasks
        });
      });
  });
});

describe("GET /tasks/:id endpoint", () => {
  test("returns a 200 status code and the task object for an existing task", async () => {
    const validTaskId = "1"; // Replace with an ID of an existing task
    const response = await request(app)
      .get(`/tasks/${validTaskId}`)
      .expect("Content-Type", /json/)
      .expect(200);

    // Validate structure of the task object (based on the fields you expect to be present)
    expect(response.body).toHaveProperty("id", validTaskId);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    // Add more checks as necessary
  });

  test("returns a 403 status code when the task exists but the user lacks permissions", async () => {
    const validTaskIdButForbidden = "2"; // Replace with an ID the user cannot access
    await request(app)
      .get(`/tasks/${validTaskIdButForbidden}`)
      .expect("Content-Type", /json/)
      .expect(403)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Forbidden" });
      });
  });

  test("returns a 404 status code if the task does not exist", async () => {
    const nonExistentTaskId = "non-existent-task-id"; // Use an ID that does not exist
    await request(app)
      .get(`/tasks/${nonExistentTaskId}`)
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Task not found" });
      });
  });
});

describe("PUT /tasks/:id endpoint", () => {
  test("updates a task successfully and returns the correct message", async () => {
    const taskId = "1"; // Replace with an actual task ID
    const taskUpdateData = {
      title: "Updated Task Title",
      description: "Updated Task Description",
      dueDate: "2023-12-31", // Example date, adjust accordingly
      status: "IN_PROGRESS", // Example status, adjust accordingly
    };

    await request(app)
      .put(`/tasks/${taskId}`)
      .send(taskUpdateData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Task updated" });
      });
  });

  test("returns a 400 status code if some parameters are missing", async () => {
    const taskId = "1"; // Use an ID intended for this test
    const incompleteData = {
      // Missing required 'title' parameter in this example
      description: "Updated Task Description",
    };

    await request(app)
      .put(`/tasks/${taskId}`)
      .send(incompleteData)
      .expect("Content-Type", /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toContain(
          "You missed parameters: 'id' or 'title'"
        );
      });
  });

  test("returns a 403 status code if the user has no access", async () => {
    const taskId = "2"; // Replace with a suitable task ID

    await request(app)
      .put(`/tasks/${taskId}`)
      .send({
        title: "Title Attempt",
        description: "Description Attempt",
      }) // Example data
      .expect("Content-Type", /json/)
      .expect(403)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Forbidden" });
      });
  });

  test("returns a 404 status code if the task does not exist", async () => {
    const nonExistentTaskId = "3"; // Use a definitely non-existent task ID

    await request(app)
      .put(`/tasks/${nonExistentTaskId}`)
      .send({
        title: "Non-existent Title",
        description: "Non-existent Description",
      }) // Example data
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Task not found" });
      });
  });
});

describe("DELETE /tasks/:id", () => {
  test("successfully removes a task and returns the correct message", async () => {
    const taskId = "1"; // Replace with an ID of a task that can be deleted

    await request(app)
      .delete(`/tasks/${taskId}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          msg: "Task removed successfully",
        });
      });
  });

  test("returns a 403 status code if the user has no access to the task", async () => {
    const taskId = "2"; // Replace with an ID for which the user lacks access rights

    await request(app)
      .delete(`/tasks/${taskId}`)
      .expect("Content-Type", /json/)
      .expect(403)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Forbidden" });
      });
  });

  test("returns a 404 status code if the task does not exist", async () => {
    const nonExistentTaskId = "3"; // Use an ID that does not exist

    await request(app)
      .delete(`/tasks/${nonExistentTaskId}`)
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Task not found" });
      });
  });
});

describe("POST /tasks/", () => {
  test("creates a new task successfully and returns the correct message along with an ID", async () => {
    const newTaskData = {
      title: "New Task Title",
      description: "New Task Description",
      dueDate: "2023-12-31", // Example date, adjust as necessary
    };

    await request(app)
      .post("/tasks/")
      .send(newTaskData)
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body.msg).toEqual("Task created");
        expect(response.body).toHaveProperty("id"); // Check if ID is present in the response
      });
  });

  test("returns a 400 status code if required parameters are missing", async () => {
    const incompleteData = {
      // Missing 'title', which is a required parameter
      description: "Task without a title",
    };

    await request(app)
      .post("/tasks/")
      .send(incompleteData)
      .expect("Content-Type", /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toContain("You missed parameter 'title'");
        // Optionally, check for specific missing parameter names if your API provides them
      });
  });
});

describe("PATCH /tasks/:id", () => {
  test("marks a task as completed successfully", async () => {
    const taskId = "1"; // Replace with an actual task ID
    await request(app)
      .patch(`/tasks/${taskId}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          msg: "Task marked as completed",
        });
      });
  });

  test("returns a 403 status code if the user does not have access", async () => {
    const taskId = "2"; // Replace with an ID for which the user lacks access
    await request(app)
      .patch(`/tasks/${taskId}`)
      .expect("Content-Type", /json/)
      .expect(403)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Forbidden" });
      });
  });

  test("returns a 404 status code if the task does not exist", async () => {
    const nonExistentTaskId = "3"; // Use a definitely non-existent task ID
    await request(app)
      .patch(`/tasks/${nonExistentTaskId}`)
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Task not found" });
      });
  });

  // This scenario might be less common since typically the absence of the 'id' parameter would be caught by the routing framework before reaching the handler.
  // However, if your API behaves differently or you have a specific case to test, you might include it as shown below.
  test("returns a 400 status code if the task id parameter is missing", async () => {
    // This test might need to be adjusted based on your API's routing and parameter handling
    await request(app)
      .patch("/tasks/") // Notice the missing ID in the URL
      .expect("Content-Type", /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
          msg: "Missing parameter: id",
        });
      });
  });
});

describe("GET /user endpoint", () => {
  test("retrieves user information successfully", async () => {
    const expectedUserInfo = {
      firstname: "Jordi",
      lastname: "Galobart",
      email: "test@example.com",
    };

    await request(app)
      .get("/user")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        // Check if the response body matches the expected user information
        expect(response.body).toEqual(expectedUserInfo);
      });
  });
});

describe("POST /user/login", () => {
  test("successfully logs in a user with correct credentials", async () => {
    const userData = {
      email: "test@example.com",
      password: "correctpassword", // Assuming this is the correct password
    };

    await request(app)
      .post("/user/login")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Login successful" });
      });
  });

  test("returns a 403 status code when incorrect credentials are provided", async () => {
    const userData = {
      email: "test@example.com",
      password: "wrongpassword", // This is the wrong password
    };

    await request(app)
      .post("/user/login")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(403)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Forbidden" });
      });
  });

  test("returns a 404 status code if the user does not exist", async () => {
    const userData = {
      email: "nonexistent@example.com", // Assuming no user exists with this email
      password: "somepassword",
    };

    await request(app)
      .post("/user/login")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "User not found" });
      });
  });
});

afterAll((done) => {
  server.close(done);
});
