const dateHelper = require("./dateHelper");
class Validators{
    constructor(dateHelper){
        this.dateHelper = dateHelper;
    }
    mastersValidator(infoObj){
        const falseStatus = 400;
        for (let key in infoObj) {
            if (!infoObj[key]) {
                return { success: false, msg: "Please, fill all fields!", status: falseStatus }
            }
            switch (key) {
              case "name":
                if (infoObj[key].match(/\d/) || !infoObj[key].match(/\b\w{3,20}\b/)) {
                    return {success: false, msg: "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!", status: falseStatus};
                }
                break;
              case "rating":
                if (+infoObj[key] <= 0 || +infoObj[key] > 5) {
                    return {success: false, msg: "Rating value must be from 1 to 5 inclusive", status: falseStatus};
                }
                break;
              case "towns":
                if (infoObj[key].match(/\s/)) {
                    return {success: false, msg: "Towns field must not contain space character", status: falseStatus};
                }
                break;
            }
        }
        return {success: true};
    }
    ordersValidator(infoObj){
        for (let key in infoObj) {
            if (!infoObj[key]) {
                return {success: false, msg: "Please, fill all fields!", status: 400}
            }
            switch (key) {
                case "name":
                if (infoObj[key].match(/\d/) || !infoObj[key].match(/\b\w{3,20}\b/)) {
                    return {
                        success: false,
                        msg: "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!",
                        status: 400
                    };
                }
                break;
                case "email":
                if (!infoObj[key].match(/^\w+@[a-zA-Z_0-9]+?\.[a-zA-Z]{2,}$/)) {
                    return {
                      success: false,
                      msg: "Invalid email format. Please check your email!",
                      status: 400,
                    };
                }
                break;
                case "size":
                if (!infoObj[key].match(/\blarge\b|\bsmall\b|\bmiddle\b/)) {
                    return {
                      success: false,
                      msg:
                        "The size field should only include such values:\n1. small\n2. middle\n3. large",
                      status: 400,
                    };
                }
                break;
                case "date":
                if (
                    !infoObj[key].match(
                      /(20|21|22)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/
                    )
                  ) {
                    return {
                      success: false,
                      msg: "The date must be in the format: dd-mm-yyyy",
                      status: 400,
                    };
                }
                if (!this.dateHelper.isClientDateLargeThenCurrDate(infoObj[key])) {
                    return {
                      success: false,
                      msg: "Date must not be less than or equal to the current date!",
                      status: 400,
                    };
                  }
                  break;
                case "time":
                    if(infoObj[key] >= "18:00" || infoObj[key] < "09:00"){
                        return {success: false, msg: "Time should not be more than 18:00 and less than 09:00", status: 400};
                    }
                    break;
              }
        }
        return {success: true}
    }
    townsValidator(infoObj){
        if (!infoObj.name) {
            return { success: false, msg: "Please, fill all fields!", status: 400 }
        }
        if (!infoObj.name.match(/^[A-Z]/)) {
            return {success: false, msg: "The string name must start with capital letter", status: 400}
          }
        if (infoObj.name.match(/\d/)) {
            return {success: false, msg: "The string name must not contain numbers!", status: 400}
        }
        return {success: true}
    }
    updateUserInfoValidator(infoObj){
        if (!infoObj.email.match(/^\w+@[a-zA-Z_0-9]+?\.[a-zA-Z]{2,}$/)) {
            return {
              success: false,
              msg: "Invalid email format. Please check your email!",
              status: 400,
            };
        }
        if(infoObj.name.match(/\d/) || !infoObj.name.match(/\b\w{3,20}\b/)){
            return {success: false, msg: "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!", status: 400};
        }
        return {success: true}
    }
    loginValidator(infoObj){
        const {email, password} = infoObj;
        if (!email.match(/^\w+@[a-zA-Z_0-9]+?\.[a-zA-Z]{2,}$/)) {
            return {success: false, msg: "Invalid email format. Please check your email!", status: 400}
        }
        if (password.length < 4 || password.length > 16) {
            return {success: false, msg: "Password must not be less than 4 characters and must not be longer than 16 characters!", status: 400};
        }
        return {success: true}
    }
    signUpValidator(infoObj){
        for (let key in infoObj) {
            if (!infoObj[key]){
              return { success: false, msg: "Please, fill all fields!", status: 400 }
            }
            switch (key) {
              case "email":
                if (!infoObj[key].match(/^\w+@[a-zA-Z_0-9]+?\.[a-zA-Z]{2,}$/)) {
                    return {success: false, msg: "Invalid email format. Please check your email!", status: 400};
                }
                if (infoObj[key].toLowerCase().match(/admin/)) {
                    return {success: false, msg: "Your email cannot contain the word 'admin'", status: 400};
                }
                break;
              case "password":
                if (infoObj[key].length < 4 || infoObj[key].length > 16) {
                    return {success: false, msg: "Password must not be less than 4 characters and must not be longer than 16 characters!!!", status: 400};
                }
                break;
              case "name":
                if (infoObj[key].match(/\d/) || !infoObj[key].match(/\b\w{3,20}\b/)) {
                    return {success: false, msg: "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!", status: 400};
                }
                break;
            }
        }
        return {success: true};
    }
}

module.exports = new Validators(dateHelper);