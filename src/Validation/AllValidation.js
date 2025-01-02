exports.validName = (name) => {
    const regex = /^[a-zA-Z ]+$/;
    return regex.test(name);
}

exports.validEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
}

exports.validPassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
}



