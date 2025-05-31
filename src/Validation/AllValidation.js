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

exports.validNumber = (num) => {
    const regex = /^[0-9]+$/;
    return regex.test(num);
}

exports.validURL = (url) => {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return regex.test(url);
}

exports.validHexCode = (hex) => {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return regex.test(hex);
}

exports.validDecimal = (num) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(num);
}
