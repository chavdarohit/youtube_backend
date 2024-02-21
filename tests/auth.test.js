const userCollectionQueries = require("../queries/userCollectionQueries");
const request = require("./request");
let validUser = {
  email: "test@example.com",
  // password: "securePassword",
  password: "$2a$10$9YbP8YRtKcwqt73cBcGW8OIcH1N7jKJdTSr8fbL4/K/S6soiqPehK",
};

let user = {
  firstname: "rohit",
  lastname: "chavda",
  password: "$2a$10$7A7DYxLdYGP.9IFZlmnOHOJsWLoH.XIeSx/RNGRlYfwB4tuMFPyyC",
  email: "test@example.com",
  mobile: 7878776207,
  gender: "m",
  bday: "2000-12-8",
  age: 23,
  image:
    "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
  isPremium: false,
  channelsSubscribed: [],
  buddies: [],
  userId: "8db871d4-9413-4437-a49b-5847c46275df",
};

describe("Authentication Endpoint", () => {
  const _getuserFromDbUsingEmail =
    userCollectionQueries.getUserFromDbUsingEmail;
  const _signup = userCollectionQueries.signup;
  const _getUserFromDbUsingId = userCollectionQueries.getUserFromDbUsingId;

  beforeEach(() => {
    userCollectionQueries.getUserFromDbUsingEmail = jest.fn((requestEmail) => {
      if (requestEmail === validUser.email) {
        return validUser;
      } else {
        return null;
      }
    });

    userCollectionQueries.signup = jest.fn();
    userCollectionQueries.getUserFromDbUsingId = jest.fn(() => user);
  });

  afterEach(() => {
    userCollectionQueries.getUserFromDbUsingEmail = _getuserFromDbUsingEmail;
    userCollectionQueries.signup = _signup;
    userCollectionQueries.getUserFromDbUsingId = _getUserFromDbUsingId;
  });

  describe("login authentications", () => {
    it("Login succesfull : with proper data", async () => {
      const response = await request.post("/api/auth/login").send({
        email: "test@example.com",
        password: "securePassword",
      });
      expect(response.body.user).toEqual(validUser);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login succesfull");
      expect(response.body.token).toBeDefined();
    });

    it("Login failed : with no proper email", async () => {
      const response = await request.post("/api/auth/login").send({
        email: "flamingo@mono.com",
        password: "securePassword",
      });
      expect(response.status).toBe(401);
      expect(response.text).toBe("Invalid credentials");
    });
    it("Login failed : with no proper Password", async () => {
      const response = await request.post("/api/auth/login").send({
        email: "test@example.com",
        password: "falmi1234",
      });
      expect(response.status).toBe(401);
      expect(response.text).toBe("Invalid credentials");
    });
    it("Login failed : when no data provided from the user", async () => {
      const response = await request.post("/api/auth/login").send({});
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Invalid user email");
      expect(response.body.msg[0].field).toBe("email");
    });
    it("Login failed : Invalid user Email", async () => {
      const response = await request.post("/api/auth/login").send({
        email: "chavdarohit.com",
        password: "securePassword",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Email is Not valid");
      expect(response.body.msg[0].field).toBe("email");
    });
  });

  describe("Signup validations ", () => {
    it("Signup Succesfull : All data is correct ", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "testing@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Registration succesfull");
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });
    it("Signup failed : Firstname is missing ", async () => {
      const response = await request.post("/api/auth/signup").send({
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Enter first name");
      expect(response.body.msg[0].field).toBe("firstname");
    });
    it("Signup failed : Firstname is not string", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: 123,
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Enter Valid Firstname");
      expect(response.body.msg[0].field).toBe("firstname");
    });
    it("Signup failed : Firstname is short than 3 characters", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "ro",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Minimum 3 characters required"
      );
      expect(response.body.msg[0].field).toBe("firstname");
    });
    it("Signup failed : Firstname is more than 20 characters", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit chavda chavda rohit testing and ttesting",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Maximum 20 characters allowed"
      );
      expect(response.body.msg[0].field).toBe("firstname");
    });

    it("Signup failed : Firstname conatains nuumbers", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit123",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Firstname can only contain characters"
      );
      expect(response.body.msg[0].field).toBe("firstname");
    });

    //------------------------------------------------------------------------------------------------------------
    it("Signup failed : Lastname is missing ", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Enter Last name");
      expect(response.body.msg[0].field).toBe("lastname");
    });
    it("Signup failed : Lastname is not string", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: 456,
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Enter Valid lastname");
      expect(response.body.msg[0].field).toBe("lastname");
    });
    it("Signup failed : Lastname is short than 3 characters", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "ch",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Minimum 3 characters required"
      );
      expect(response.body.msg[0].field).toBe("lastname");
    });
    it("Signup failed : lastname is more than 20 characters", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit ",
        lastname: "chavda chavda chavda rohit testing and ttesting",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Maximum 20 characters allowed"
      );
      expect(response.body.msg[0].field).toBe("lastname");
    });

    it("Signup failed : lastname conatains numbers", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda11534",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Lastname can only contain characters"
      );
      expect(response.body.msg[0].field).toBe("lastname");
    });
    it("Signup failed : when password missing", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        // password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Enter password");
      expect(response.body.msg[0].field).toBe("password");
    });
    it("Signup failed : when confirm password missing", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        // cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Enter confirm password");
      expect(response.body.msg[0].field).toBe("cpassword");
    });
    it("Signup failed : when password is not entered correctly", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "socialpilot",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Password Must be atleast 8 characters and contain atleast one Capital letter " +
          " ,One small letter " +
          " One number " +
          " one special symbol"
      );
      expect(response.body.msg[0].field).toBe("password");
    });
    it("Signup failed : when password is not equal to confirm password", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456789",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Password and Confirm password is not Equal"
      );
      expect(response.body.msg[0].field).toBe("cpassword");
    });
    it("Signup failed : when email is not provided", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Invalid user email");
      expect(response.body.msg[0].field).toBe("email");
    });
    it("Signup failed : when email is not in proper format", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "testexamplecom",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Email is Not valid");
      expect(response.body.msg[0].field).toBe("email");
    });
    it("Signup failed : when Gender is not provided", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        // gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[1].message).toBe("Enter user gender");
      expect(response.body.msg[1].field).toBe("gender");
    });
    it("Signup failed : when Gender is not 'm' or 'f' ", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "testing@example.com",
        mobile: "7878776207",
        gender: 123,
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Gender Must be 'Male' or 'Female'"
      );
      expect(response.body.msg[0].field).toBe("gender");
    });
    it("Signup failed : when Mobile no is not provided ", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "testing@example.com",
        // mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Enter mobile");
      expect(response.body.msg[0].field).toBe("mobile");
    });
    it("Signup failed : when Mobile no is not string", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "testing@example.com",
        mobile: 7878776207,
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Enter Valid mobile");
      expect(response.body.msg[0].field).toBe("mobile");
    });
    it("Signup failed : when Mobile no , not having exact 10 digits", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "testing@example.com",
        mobile: "515353313127878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Mobile musthave only 10 digits no Characters"
      );
      expect(response.body.msg[0].field).toBe("mobile");
    });
    it("Signup failed : when Birthdate is not provided", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "testing@example.com",
        mobile: "7878776207",
        gender: "m",
        // bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("Enter Birthdate");
      expect(response.body.msg[0].field).toBe("bday");
    });
    it("Signup failed : when Birth year is greater then current ", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "testing@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2030-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe(
        "Birthdate is not valid or can't be Future date"
      );
      expect(response.body.msg[0].field).toBe("bday");
    });
    it("Signup failed : when user already exists", async () => {
      const response = await request.post("/api/auth/signup").send({
        firstname: "rohit",
        lastname: "chavda",
        password: "Sp@123456",
        cpassword: "Sp@123456",
        email: "test@example.com",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
      });
      expect(response.body.status).toBe(204);
      expect(response.body.msg[0].message).toBe("User already Exists");
      expect(response.body.msg[0].field).toBe("email");
    });
  });
});
