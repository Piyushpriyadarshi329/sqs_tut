"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { DeleteMessageCommand, SQSClient, ReceiveMessageCommand, ChangeMessageVisibilityCommand, SendMessageCommand } = require('@aws-sdk/client-sqs');
var randomstring = require("randomstring");
const awsCustomerId = '';
const awsQueue = 'sample-queue.fifo';
const awsRegion = 'eu-west-1';
const queueUrl = `https://sqs.${awsRegion}.amazonaws.com/${awsCustomerId}/${awsQueue}`;
const visibilityTimeout = 60;
const sqsClient = new SQSClient({
    credentials: {
        accessKeyId: "",
        secretAccessKey: ""
    },
    endpoint: `https://sqs.${awsRegion}.amazonaws.com`,
    region: `${awsRegion}`,
    apiVersion: '2012-11-05'
});
function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({
                key1: "value1",
                key2: "value2",
            }),
            MessageDeduplicationId: randomstring.generate(7),
            MessageGroupId: randomstring.generate(7),
        });
        try {
            const response = yield sqsClient.send(command);
            console.log(">>> sendMessage RESPONSE>>>", response);
        }
        catch (error) {
            console.log(">>> sendMessage ERROR>>>", error);
            throw new Error(error);
        }
    });
}
function getMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
        });
        try {
            const response = yield sqsClient.send(command);
            console.log(">>> getMessage RESPONSE>>>", response.Messages);
            return response.Messages[0].ReceiptHandle;
        }
        catch (error) {
            console.log(">>> getMessage ERROR>>>", error);
            throw new Error(error);
        }
    });
}
function updateMessageVisibility(queueUrl, receiptHandle, visibilityTimeout) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new ChangeMessageVisibilityCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
            VisibilityTimeout: visibilityTimeout,
        });
        try {
            const response = yield sqsClient.send(command);
            console.log(">>> updateMessageVisibility RESPONSE>>>", response);
        }
        catch (error) {
            console.log(">>> updateMessageVisibility ERROR>>>", error);
            throw new Error(error);
        }
    });
}
function deleteMessage(receiptHandle) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
        });
        try {
            const response = yield sqsClient.send(command);
            console.log(">>> deleteMessage RESPONSE>>>", response);
        }
        catch (error) {
            console.log(">>> deleteMessage ERROR>>>", error);
            throw new Error(error);
        }
    });
}
const fn = () => __awaiter(void 0, void 0, void 0, function* () {
    yield sendMessage();
    let receiptHandle = yield getMessage();
    yield deleteMessage(receiptHandle);
});
fn();
