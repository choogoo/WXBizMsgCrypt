#!/usr/bin/env python
# -*- coding: utf-8 -*-
#########################################################################
# Author: jonyqin
# Created Time: Thu 11 Sep 2014 03:55:41 PM CST
# File Name: demo.py
# Description: WXBizMsgCrypt 使用demo文件
#########################################################################
from WXBizMsgCrypt import WXBizMsgCrypt
import requests
import xmltodict
import json

if __name__ == "__main__":   
   """ 
   1.第三方回复加密消息给公众平台；
   2.第三方收到公众平台发送的消息，验证消息的安全性，并对消息进行解密。
   """
   encodingAESKey = "2AtfpPTPyWMj**************V3oJYX8y0nhd" 
   token = "uePZd*****************FFadSrIS"
   nonce = "1320562132"
   appid = "tR36********yG6Y"

   to_xml = """<xml><managerid><![CDATA[fbk*****NaT]]></managerid><skill><skillname><![CDATA[技能名称1]]></skillname><title><![CDATA[标准问题2]]></title><question><![CDATA[相似问题1]]></question><question><![CDATA[相似问题2]]></question><question><![CDATA[相似问题3]]></question><answer><![CDATA[1]]></answer><answer><![CDATA[2]]></answer></skill><skill><skillname><![CDATA[技能名称1]]></skillname><title><![CDATA[标准问题3]]></title><question><![CDATA[相似问题1]]></question><answer><![CDATA[1]]></answer></skill></xml>"""

   #测试加密接口
   encryp_test = WXBizMsgCrypt(token,encodingAESKey,appid)
   ret,encrypt_xml = encryp_test.EncryptMsg(to_xml,nonce)   
   print(ret,encrypt_xml)

   dict_xml = xmltodict.parse(encrypt_xml)
   # print(dict_xml)
   jsonStr = json.dumps(dict_xml,ensure_ascii=False)
   print(jsonStr)
   jsonObj = json.loads(jsonStr)
   encrypt = jsonObj['xml']['Encrypt']

   url = 'https://openai.weixin.qq.com/openapi/batchimportskill/'+token
   data = {"encrypt": encrypt}
   res = requests.post(url=url,json=data)
   print(res.text)
