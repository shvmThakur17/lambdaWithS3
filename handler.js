"use strict";
const AWS = require("aws-sdk");
// const fileType = require("file-type");
// const parseMultipart = require('parse-multipart');
const Multipart = require("lambda-multipart");
const { uuid } = require("uuidv4");
const lambda = new AWS.Lambda();

// const { v4: uuid } = require('uuid');
const s3 = new AWS.S3();

module.exports.hello = async (event) => {
  try {
    const { fields, files } = await parseMultipartFormData(event);
    const filename = uuid();
    const options = {
      Bucket: "lamc3bucket",
      Key: `${filename}.png`,
      Body: files[0],
    };
    await s3.upload(options).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({
        link: `https://lamc3bucket.s3.amazonaws.com/${filename}.png`,
      }),
    };
  } catch (error) {
    console.log("error", error);
  }
};
const parseMultipartFormData = async (event) => {
  return new Promise((resolve, reject) => {
    const parser = new Multipart(event);
    parser.on("finish", (result) => {
      resolve({ fields: result.fields, files: result.files });
    });
    parser.on("error", (error) => {
      return reject(error);
    });
  });
};
//Lambda invoke function s3 object created
module.exports.lambdaInvokeOnceS3fileUploaded = async (event) => {
  console.log("first lambda invoke lambdaInvokeOnceS3fileUploaded",event);
  let sampleData = { number1: 1, number2: 2 };
  let params = {
    FunctionName: 'getimageMetadata',
    Payload: JSON.stringify(event)
  };

  try {
    await lambda.invoke(params).promise();
    return true;
  } catch (e) {
    console.log('invokeLambda :: Error: ' + e);
  }  
}

//call from S3 step function
module.exports.getimageMetadata = async (event) => {
  console.log("event getimageMetadata",event);
   console.log("lambda execute function");
}
