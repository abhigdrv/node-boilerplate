const Validator = require('validatorjs');
const prisma = require('../../Database/Connection')

let rules = {
    name: 'required',
    email: 'required_without_all:mobile|email',
    mobile: 'required_without_all:email',
    password: 'required'
};

let loginRules = {
  email: 'required_without_all:mobile|email',
  mobile: 'required_without_all:email',
  password: 'required'
}

const validateUser = async (req, res, next) => {
    let validation = new Validator(req.body, rules);
    if (validation.fails()) {
      return res.status(403).json(validation.errors);
    }    
    const { email } = req.body;
    const existingRecord = await prisma.user.findFirst({
      where: { email },
    });
    if (existingRecord) {
      return res.status(403).json({errors:'Email already exists'});
    }
    return next();
}

const validateRegister = async(req, res, next) => {
  let validation = new Validator(req.body, rules);
  if (validation.fails()) {
    return res.status(403).json(validation.errors);
  } 
  const { email, mobile } = req.body;
  const existingEmail = email && await prisma.user.findFirst({
    where: { email }
  });
  if (existingEmail) {
    return res.status(403).json({errors:'Email already exists'});
  }
  const existingMobile = mobile && await prisma.user.findFirst({
    where: { mobile }
  });
  if (existingMobile) {
    return res.status(403).json({errors:'Mobile already exists'});
  }
  return next();
}

const validateLogin = async(req, res, next) => {
  let validation = new Validator(req.body, loginRules);
  if (validation.fails()) {
    return res.status(403).json(validation.errors);
  } 
  return next();
}

module.exports = {
  validateUser,
  validateRegister,
  validateLogin
};