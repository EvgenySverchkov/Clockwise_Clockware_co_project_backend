const validators = require("../helpers/validators");

describe("Testing master validator", () => {
  const validObj = { name: "Alex", towns: "Dnipro,Uzhorod", rating: "5" };
  test("Valid all fields", () => {
    expect(validators.mastersValidator(validObj)).toMatchObject({
      success: true,
    });
  });
  describe("Empty fields", () => {
    const resObj = {
      success: false,
      msg: "Please, fill all fields!",
      status: 400,
    };
    test("All fields are empty", () => {
      expect(
        validators.mastersValidator({ name: "", towns: "", rating: "" })
      ).toMatchObject(resObj);
    });
    test("Name field is empty", () => {
      expect(
        validators.mastersValidator({ ...validObj, name: "" })
      ).toMatchObject(resObj);
    });
    test("Rating field is empty", () => {
      expect(
        validators.mastersValidator({ ...validObj, rating: "" })
      ).toMatchObject(resObj);
    });
    test("Towns field is empty", () => {
      expect(
        validators.mastersValidator({ ...validObj, towns: "" })
      ).toMatchObject(resObj);
    });
  });
  describe("Name field validation", () => {
    const resObj = {
      success: false,
      msg:
        "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!",
      status: 400,
    };
    test("Contain number", () => {
      expect(
        validators.mastersValidator({ ...validObj, name: "Alex1" })
      ).toMatchObject(resObj);
    });
    test("Less than 3 characters", () => {
      expect(
        validators.mastersValidator({ ...validObj, name: "Al" })
      ).toMatchObject(resObj);
    });
    test("More than 20 characters", () => {
      expect(
        validators.mastersValidator({
          ...validObj,
          name: "AlexAlexAlexAlexAlexA",
        })
      ).toMatchObject(resObj);
    });
    test("Contain Cyrillic characters", () => {
      expect(
        validators.mastersValidator({ ...validObj, name: "Алексей" })
      ).toMatchObject(resObj);
    });
  });
  describe("Rating field validation", () => {
    const resObj = {
      success: false,
      msg: "Rating value must be from 1 to 5 inclusive",
      status: 400,
    };
    test("Value less than 0", () => {
      expect(
        validators.mastersValidator({ ...validObj, rating: "-1" })
      ).toMatchObject(resObj);
    });
    test("Value is 0", () => {
      expect(
        validators.mastersValidator({ ...validObj, rating: "0" })
      ).toMatchObject(resObj);
    });
    test("Value more than 5", () => {
      expect(
        validators.mastersValidator({ ...validObj, rating: "6" })
      ).toMatchObject(resObj);
    });
  });
  describe("Towns field validation", () => {
    test("Contain space character", () => {
      expect(
        validators.mastersValidator({ ...validObj, towns: "Dnipro, Uzhorod" })
      ).toMatchObject({
        success: false,
        msg: "Towns field must not contain space character",
        status: 400,
      });
    });
  });
});

describe("Testing order validator", () => {
  const validObj = {
    name: "Alex",
    email: "example@mail.com",
    size: "large",
    town: "Uzhorod",
    date: "2021-02-10",
    time: "12:00",
    masterId: "1",
    endTime: "15:00",
  };
  test("Valid all fields", () => {
    expect(validators.ordersValidator(validObj)).toMatchObject({
      success: true,
    });
  });
  describe("Empty fields", () => {
    const resObj = {
      success: false,
      msg: "Please, fill all fields!",
      status: 400,
    };
    test("All fields are empty", () => {
      expect(
        validators.ordersValidator({
          name: "",
          email: "",
          size: "",
          town: "",
          date: "",
          time: "",
          masterId: "",
          endTime: "",
        })
      ).toMatchObject(resObj);
    });
    test("Name field is empty", () => {
      expect(
        validators.ordersValidator({ ...validObj, name: "" })
      ).toMatchObject(resObj);
    });
    test("Email field is empty", () => {
      expect(
        validators.ordersValidator({ ...validObj, email: "" })
      ).toMatchObject(resObj);
    });
    test("Size field is empty", () => {
      expect(
        validators.ordersValidator({ ...validObj, size: "" })
      ).toMatchObject(resObj);
    });
    test("Town field is empty", () => {
      expect(
        validators.ordersValidator({ ...validObj, town: "" })
      ).toMatchObject(resObj);
    });
    test("Date field is empty", () => {
      expect(
        validators.ordersValidator({ ...validObj, date: "" })
      ).toMatchObject(resObj);
    });
    test("Time field is empty", () => {
      expect(
        validators.ordersValidator({ ...validObj, time: "" })
      ).toMatchObject(resObj);
    });
    test("Master field is empty", () => {
      expect(
        validators.ordersValidator({ ...validObj, masterId: "" })
      ).toMatchObject(resObj);
    });
    test("End time field is empty", () => {
      expect(
        validators.ordersValidator({ ...validObj, endTime: "" })
      ).toMatchObject(resObj);
    });
  });
  describe("Name field validation", () => {
    const resObj = {
      success: false,
      msg:
        "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!",
      status: 400,
    };
    test("Contain number", () => {
      expect(
        validators.ordersValidator({ ...validObj, name: "Alex1" })
      ).toMatchObject(resObj);
    });
    test("Less than 3 characters", () => {
      expect(
        validators.ordersValidator({ ...validObj, name: "Al" })
      ).toMatchObject(resObj);
    });
    test("More than 20 characters", () => {
      expect(
        validators.ordersValidator({
          ...validObj,
          name: "AlexAlexAlexAlexAlexA",
        })
      ).toMatchObject(resObj);
    });
    test("Contain Cyrillic characters", () => {
      expect(
        validators.ordersValidator({ ...validObj, name: "Алексей" })
      ).toMatchObject(resObj);
    });
  });
  describe("Email field validation", () => {
    test("Wrong email format", () => {
      expect(
        validators.ordersValidator({ ...validObj, email: "example@mail.ru." })
      ).toMatchObject({
        success: false,
        msg: "Invalid email format. Please check your email!",
        status: 400,
      });
    });
  });
  describe("Size field validation", () => {
    test("Wrong size value", () => {
      expect(
        validators.ordersValidator({ ...validObj, size: "largeg" })
      ).toMatchObject({
        success: false,
        msg:
          "The size field should only include such values:\n1. small\n2. middle\n3. large",
        status: 400,
      });
    });
  });
  describe("Date field validation", () => {
    test("Wrong date format", () => {
      expect(
        validators.ordersValidator({ ...validObj, date: "23-08-2020" })
      ).toMatchObject({
        success: false,
        msg: "The date must be in the format: yyyy-mm-dd",
        status: 400,
      });
    });
    test("Date less than current date", () => {
      const currDate = new Date();
      const wrongDate = `${currDate.getFullYear() - 1}-${(
        "0" +
        (+currDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
      expect(
        validators.ordersValidator({ ...validObj, date: wrongDate })
      ).toMatchObject({
        success: false,
        msg: "Date must not be less than or equal to the current date!",
        status: 400,
      });
    });
  });
  describe("Time field validation", () => {
    const resObj = {
      success: false,
      msg: "Time should not be more than 18:00 and less than 09:00",
      status: 400,
    };
    test("Time more than 18:00", () => {
      expect(
        validators.ordersValidator({ ...validObj, time: "18:01" })
      ).toMatchObject(resObj);
    });
    test("time is less than 09:00", () => {
      expect(
        validators.ordersValidator({ ...validObj, time: "08:59" })
      ).toMatchObject(resObj);
    });
  });
});

describe("Testing town validator", () => {
  test("Empty all fields", () => {
    expect(validators.townsValidator({ name: "" })).toMatchObject({
      success: false,
      msg: "Please, fill all fields!",
      status: 400,
    });
  });
  describe("Name field validation", () => {
    test("Start with lowercase letter", () => {
      expect(validators.townsValidator({ name: "dnipro" })).toMatchObject({
        success: false,
        msg: "The string name must start with capital letter",
        status: 400,
      });
    });
    test("Contain number", () => {
      expect(validators.townsValidator({ name: "Dnipro1" })).toMatchObject({
        success: false,
        msg: "The string name must not contain numbers!",
        status: 400,
      });
    });
  });
  test("Valid all data", () => {
    expect(validators.townsValidator({ name: "Dnipro" })).toMatchObject({
      success: true,
    });
  });
});

describe("Testing update user info validator", () => {
  const validObj = { email: "example@mail.com", name: "Alex" };
  test("Valid all fields", () => {
    expect(validators.updateUserInfoValidator(validObj)).toMatchObject({
      success: true,
    });
  });
  describe("Name field validation", () => {
    const resObj = {
      success: false,
      msg:
        "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!",
      status: 400,
    };
    test("Contain number", () => {
      expect(
        validators.updateUserInfoValidator({ ...validObj, name: "Alex1" })
      ).toMatchObject(resObj);
    });
    test("Less than 3 characters", () => {
      expect(
        validators.updateUserInfoValidator({ ...validObj, name: "Al" })
      ).toMatchObject(resObj);
    });
    test("More than 20 characters", () => {
      expect(
        validators.updateUserInfoValidator({
          ...validObj,
          name: "AlexAlexAlexAlexAlexA",
        })
      ).toMatchObject(resObj);
    });
    test("Contain Cyrillic characters", () => {
      expect(
        validators.updateUserInfoValidator({ ...validObj, name: "Алексей" })
      ).toMatchObject(resObj);
    });
  });
  describe("Email field validation", () => {
    test("Wrong email format", () => {
      expect(
        validators.updateUserInfoValidator({
          ...validObj,
          email: "example@mail.ru.",
        })
      ).toMatchObject({
        success: false,
        msg: "Invalid email format. Please check your email!",
        status: 400,
      });
    });
  });
});

describe("Testing login validator", () => {
  const validObj = { email: "example@mail.com", password: "1234" };
  test("Valid all fields", () => {
    expect(validators.loginValidator(validObj)).toMatchObject({
      success: true,
    });
  });
  describe("Email field validation", () => {
    test("Wrong email format", () => {
      expect(
        validators.loginValidator({ ...validObj, email: "example@mail.ru." })
      ).toMatchObject({
        success: false,
        msg: "Invalid email format. Please check your email!",
        status: 400,
      });
    });
  });
  describe("Password field validation", () => {
    const resObj = {
      success: false,
      msg:
        "Password must not be less than 4 characters and must not be longer than 16 characters!",
      status: 400,
    };
    test("Password length less than 4", () => {
      expect(
        validators.loginValidator({ ...validObj, password: "123" })
      ).toMatchObject(resObj);
    });
    test("Password length is more than 16", () => {
      expect(
        validators.loginValidator({
          ...validObj,
          password: "123a123a123a123a1",
        })
      ).toMatchObject(resObj);
    });
  });
});

describe("Testing sign up validator", () => {
  const validObj = {
    name: "Alex",
    email: "example@mail.com",
    passsword: "1234",
  };
  test("Valid all fields", () => {
    expect(validators.signUpValidator(validObj)).toMatchObject({
      success: true,
    });
  });
  describe("Empty fields", () => {
    const resObj = {
      success: false,
      msg: "Please, fill all fields!",
      status: 400,
    };
    test("All fields are empty", () => {
      expect(
        validators.signUpValidator({ name: "", email: "", passsword: "" })
      ).toMatchObject(resObj);
    });
    test("Name field is empty", () => {
      expect(
        validators.signUpValidator({ ...validObj, name: "" })
      ).toMatchObject(resObj);
    });
    test("Email field is empty", () => {
      expect(
        validators.signUpValidator({ ...validObj, email: "" })
      ).toMatchObject(resObj);
    });
    test("Password field is empty", () => {
      expect(
        validators.signUpValidator({ ...validObj, password: "" })
      ).toMatchObject(resObj);
    });
  });
  describe("Email field validation", () => {
    test("Wrong email format", () => {
      expect(
        validators.signUpValidator({ ...validObj, email: "example@mail.ru." })
      ).toMatchObject({
        success: false,
        msg: "Invalid email format. Please check your email!",
        status: 400,
      });
    });
    test("Contains the words 'admin'", () => {
      expect(
        validators.signUpValidator({
          ...validObj,
          email: "superAdMiN1234@mail.ru",
        })
      ).toMatchObject({
        success: false,
        msg: "Your email cannot contain the word 'admin'",
        status: 400,
      });
    });
  });
  describe("Password field validation", () => {
    const resObj = {
      success: false,
      msg:
        "Password must not be less than 4 characters and must not be longer than 16 characters!!!",
      status: 400,
    };
    test("Password length less than 4", () => {
      expect(
        validators.signUpValidator({ ...validObj, password: "123" })
      ).toMatchObject(resObj);
    });
    test("Password length is more than 16", () => {
      expect(
        validators.signUpValidator({
          ...validObj,
          password: "123a123a123a123a1",
        })
      ).toMatchObject(resObj);
    });
  });
  describe("Name field validation", () => {
    const resObj = {
      success: false,
      msg:
        "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!",
      status: 400,
    };
    test("Contain number", () => {
      expect(
        validators.signUpValidator({ ...validObj, name: "Alex1" })
      ).toMatchObject(resObj);
    });
    test("Less than 3 characters", () => {
      expect(
        validators.signUpValidator({ ...validObj, name: "Al" })
      ).toMatchObject(resObj);
    });
    test("More than 20 characters", () => {
      expect(
        validators.signUpValidator({
          ...validObj,
          name: "AlexAlexAlexAlexAlexA",
        })
      ).toMatchObject(resObj);
    });
    test("Contain Cyrillic characters", () => {
      expect(
        validators.signUpValidator({ ...validObj, name: "Алексей" })
      ).toMatchObject(resObj);
    });
  });
});
