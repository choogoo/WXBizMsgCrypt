const rp = require('request-promise')
const WXBizMsgCrypt = require('wxcrypt');
var parser = require('xml2json');
let xml2js = require('xml2js');
var builder = new xml2js.Builder();

const encodingAESKey = ""
const token = ""
const nonce = "1111111"
const appid = ""

const rawJson = {
  managerid: 'fbkrb75TNaT',
  skill: [
    {
      skillname: '拼团20648888888',
      title: '标准问题1',
      question: ['相似问题1', '相似问题2'],
      answer: ['1']
    },
    {
      skillname: '拼团20648888888',
      title: '标准问题2',
      question: ['相似问题1'],
      answer: ['2','3','4']
    }
  ]
}
// const rawMsg = parser.toXml(rawJson)
var rawMsg = builder.buildObject(rawJson);

/*
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <managerid>fbkrb75TNaT</managerid>
  <skill>
    <skillname>技能名称1</skillname>
    <title>标准问题1</title>
    <question>相似问题1</question>
    <question>相似问题2</question>
    <answer>1</answer>
  </skill>
  <skill>
    <skillname>技能名称1</skillname>
    <title>标准问题2</title>
    <question>相似问题1</question>
    <answer>2</answer>
  </skill>
</root>
*/

rawMsg = `<xml${rawMsg.split("root")[1]}xml>`

// const rawMsg = '<xml><managerid><![CDATA[fbkrb75TNaT]]></managerid><skill><skillname><![CDATA[技能名称1]]></skillname><title><![CDATA[标准问题2]]></title><question><![CDATA[相似问题1]]></question><question><![CDATA[相似问题2]]></question><question><![CDATA[相似问题3]]></question><answer><![CDATA[1]]></answer><answer><![CDATA[2]]></answer></skill><skill><skillname><![CDATA[技能名称1]]></skillname><title><![CDATA[标准问题3]]></title><question><![CDATA[相似问题1]]></question><answer><![CDATA[1]]></answer></skill></xml>';

/*
var rawMsg = `<xml> <managerid>fbkrb75TNaT</managerid>
<skill>
  <skillname>技能名称1</skillname>
  <title>标准问题1</title>
  <question>相似问题1</question>
  <question>相似问题2</question>
  <answer>1</answer>
</skill>
<skill>
  <skillname>技能名称1</skillname>
  <title>标准问题2</title>
  <question>相似问题1</question>
  <answer>2</answer>
</skill></xml>`
*/

// console.debug(rawMsg)

/**
 * @param {string} token 公众号或企业微信Token
 * @param {string} encodingAESKey 用于消息体的加密
 * @param {string} appid 公众号的AppID或企业微信的CropID
 */
const WXBizMsgCryptnew = new WXBizMsgCrypt(token, encodingAESKey, appid);

/**
* 加密函数
* @param {string} replyMsg 返回的消息体原文
* @param {string} timestamp 时间戳，调用方生成
* @param {string} nonce 随机字符串，调用方生成
* @return {string} 用于返回的密文，以xml组织
*/
const timestamp = String(new Date().getTime())
const estr = WXBizMsgCryptnew.encryptMsg(rawMsg, timestamp, nonce)

// console.debug(estr)

// xml to json
var json = parser.toJson(estr);
// console.log("to json -> %s", json);
json = JSON.parse(json)
// console.debug(json.xml.Encrypt)

// const destr = WXBizMsgCryptnew.decryptMsg(json.xml.MsgSignature, timestamp, nonce, estr)

// console.log(destr);

async function aibot(encrypt) {
  let method = 'POST'
  let uri = `https://openai.weixin.qq.com/openapi/batchimportskill/${token}`
  let headers = {}
  let body = {
    encrypt
  }

  let opt = {
    method,
    uri,
    qs: {},
    body,
    headers,
    json: true
  }
  // console.debug(opt)

  try {
    let res = await rp(opt)
    console.debug(JSON.stringify(res))
    return res
  }
  catch (err) {
    console.error(err)
    return err
  }
}

aibot(json.xml.Encrypt)
