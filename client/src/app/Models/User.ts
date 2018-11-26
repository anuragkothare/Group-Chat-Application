export class User {
    constructor(public _id: String, public firstName: String, public lastName: String, public email: String, public mobileNumber: Number, public password: String) {
        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.password = password;

    }
}