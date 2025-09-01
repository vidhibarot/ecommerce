
// import nodemailer from 'nodemailer';
// import path from 'path';
// import handlebars from 'handlebars';
// import { readHTMLFile } from './helper';
// const sendEmail = async function (to: any, subject: any, template: any, from = global.config.FROM_EMAIL) {
//     try {
//         let transporter = null;
//         if (typeof global.config.IS_EMAIL_USE_SMTP !== 'undefined' && global.config.IS_EMAIL_USE_SMTP == 'on') {
//             transporter = nodemailer.createTransport({
//                 host: global.config.EMAIL_HOST,
//                 port: global.config.EMAIL_PORT,
//                 secure: (global.config.EMAIL_PORT == 465) ? true : false,
//                 auth: {
//                     user: global.config.FROM_EMAIL,
//                     pass: global.config.EMAIL_PASSWORD
//                 }
//             });
//         } else {
//             transporter = nodemailer.createTransport({
//                 sendmail: true,
//                 newline: 'unix',
//                 path: '/usr/sbin/sendmail'
//             })
//         }

//         let mailOptions = {
//             from: from,
//             to: to,
//             subject: subject,
//             html: template
//         }
//         if (to && to != '') {
//             return await transporter.sendMail(mailOptions,
//                 (error: any, info: any) => {
//                     if (error) {
//                         console.log('\n if Email fail ==> ', error);
//                     } else {
//                         console.log("info", info)
//                     }
//                 }
//             );
//         } else {
//             return;
//         }

//     } catch (e) {
//         console.log('\nEmail failed catch ==> ', e)
//         const templateData = { message: e ? e : '' }
//     }
// }

// const emailSender = (to: string, subject: string, data: any, template: any) => {
//     readHTMLFile(path.join(__dirname, `../../src/email_templates/${template}.html`), async function (err: any, html: any) {
//         try {
//             const compiledTemplate = handlebars.compile(html);
//             const htmlToSend = compiledTemplate(data);
//             await sendEmail(to, subject, htmlToSend)
//         } catch (e) {
//             console.log("error", e)
//         }
//     })
// }


// export { emailSender }
import nodemailer from "nodemailer";
import path from "path";
import handlebars from "handlebars";
import { readHTMLFile } from "./helper";
import { emailConfig } from "../config/emailConfig";
const sendEmail = async (to: string, subject: string, template: string) => {
  try {
    const transporter = emailConfig.IS_EMAIL_USE_SMTP === "on"
      ? nodemailer.createTransport({
          host: emailConfig.EMAIL_HOST,
          port: emailConfig.EMAIL_PORT,
          secure: emailConfig.EMAIL_PORT === 465,
          auth: {
            user: emailConfig.FROM_EMAIL,
            pass: emailConfig.EMAIL_PASSWORD,
          },
        })
      : nodemailer.createTransport({
          sendmail: true,
          newline: "unix",
          path: "/usr/sbin/sendmail",
        });

    const mailOptions = {
      from: emailConfig.FROM_EMAIL,
      to,
      subject,
      html: template,
    };

    if (to) {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info);
    }
  } catch (e) {
    console.error("Email sending failed:", e);
  }
};

const emailSender = (to: string, subject: string, data: any, template: string) => {
  readHTMLFile(path.join(__dirname, `../../src/email_teamplates/${template}.html`), async (err: any, html: any) => {
    if (err) {
      console.error("Template reading failed:", err);
      return;
    }

    try {
      const compiledTemplate = handlebars.compile(html);
      const htmlToSend = compiledTemplate(data);
      await sendEmail(to, subject, htmlToSend);
    } catch (e) {
      console.error("Template compiling failed:", e);
    }
  });
};

export { emailSender };
