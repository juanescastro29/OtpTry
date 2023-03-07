import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Twilio from "twilio";
import User from "../models/User.js";

const email = "";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {

      email = email;
      // Match Email's User
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: "Not User found." });
      }

      // Match Password's User
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect Password." });
      }

      //Assing OTP
      await assingOTP(user);

      return done(null, user);
    }
  )
);

var strategy = new LocalStrategy(
  {
    usernameField: "otp",
  },
  async (otp, done) => {

    const user = await User.findOne({ otp: otp });

    const isMatch = await user.matchOtp(otp);
    if (!isMatch) {
      return done(null, false, { message: "Incorrect Code." });
    }

    return done(null, user);
  }
)

passport.use( "otpAuth", strategy)

async function assingOTP(user) {
  const otp = String(generateOTP());
  await User.findOneAndUpdate({ email: user.email }, { otp: otp });

  sendOtp(otp, user);
}

async function sendOtp(otp, user) {
  const accountSid = "ACf1654d98bfc86d687f89f7b83dcaebe3";
  const authToken = "3bde537c249762dadeb7664c5cae5c01";
  const client = Twilio(accountSid, authToken);

  client.messages
    .create({
      body: `Tu código OTP es: ${otp}`,
      from: "+15746525715",
      to: `+57${user.phone}`,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.error(err));
}

function generateOTP() {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
