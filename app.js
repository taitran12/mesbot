const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');


const app = express();
 app.set('port', (process.env.PORT || 5000));
 //Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
 //ROUTES
 app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

app.listen(app.get('port'), function() {
	console.log("running: port")
})
const token=process.env.VERIFICATION_TOKEN;
const access=process.env.PAGE_ACCESS_TOKEN;

//Facebook Webhook
//Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === token) {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);//Forbidden
  }
});

 // sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token:access},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}
// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
    if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
    entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
        }
       else if (event.message) {
        processMessage(event);
      }
      });
    });
    res.sendStatus(200);
  }
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;
  if (payload === "Get_Started") {
    // Get user's first name from the User Profile API
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: access,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
       sendMessage(senderId, {text: greeting + "Hôm nay bạn muốn mua gì? Hãy để chúng tôi giúp bạn."});
       sendMessage(senderId,menu('Xin mời lựa chọn ạ :D'));
       //sendMessage(senderId,addPersistentMenu());
    });
  }
  else if((payload==='quanaonamnu') || (payload==='trovequanaonamnu')){
    sendMessage(senderId,{text:"Cảm ơn lựa chọn ạ :D"});
    sendMessage(senderId,quanaonamnu());
  }
  else if((payload==='quanaotreem') ||(payload==='trovequanaotreem')){
    sendMessage(senderId,{text:"Cảm ơn nè :P"});
    sendMessage(senderId,quanaotreem());
  }
  else if(payload==='phukien' ||payload==='trovephukien'){
    sendMessage(senderId,phukien("Cảm ơn nè 8-)"));
  }
  else if(payload==='trovemenu'){
    sendMessage(senderId,menu("Quý khách cần mua gì nè 3:)"));
  }
  else if((payload==='quanaonam')||(payload==='trovequanaonam')){
    sendMessage(senderId,quanaonam("Quý khách cần mua gì nè <3"));
  }
  else if((payload==='quanaonu')||(payload==='trovequanaonu')){
    sendMessage(senderId,quanaonu("Quý khách cần mua gì nè <3"));
  }
  else if(payload==='quannam'){
    sendMessage(senderId,{text:"Quý khách cần mua gì nè :/"});
    sendMessage(senderId,quannam());
  }
  else if(payload==='aonam'){
    sendMessage(senderId,{text:"Quý khách chọn đi ạ :)"});
    sendMessage(senderId,aonam());
  }
  else if(payload==='aonu'){
    sendMessage(senderId,{text:"Lựa chọn đi nè :)"});
    sendMessage(senderId,aonu());
  }
  else if(payload==='quannu'){
    sendMessage(senderId,{text:"Mời lựa chọn ạ :P"});
    sendMessage(senderId,quannu());
  }
  else if(payload==='quanaobetrai'){
    sendMessage(senderId,{text:"Mời lựa chọn ạ :P"});
    sendMessage(senderId,quanaobetrai());
  }
  else if(payload==='quanaobegai'){
    sendMessage(senderId,{text:"Mời lựa chọn ạ :P"});
    sendMessage(senderId,quanaobegai());
  }
  else if(payload==='munon'){
    sendMessage(senderId,{text:"Mời lựa chọn nè <3"});
    sendMessage(senderId,munon());
  }
  else if(payload==='giaydep'){
    sendMessage(senderId,{text:"Mời lựa chọn nè :P"});
    sendMessage(senderId,giaydep());
  }
  else{
      switch(payload){
      case 'nam_qj1':{
       var confirm=function(text){
        return {
          "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text": text,
                "buttons":[
                  {
                    "title": "Có",
                    "type": "web_url",
                    "url": "http://kenta.vn/quan-jean-nam-qj-332.html"
                  },
                  {
                      "type":"postback",
                      "title":"Không",
                      "payload":"trovequanaonam"
                  }
                ]
            }
          }
        }
       }
       sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Jean nam QJ-1. Giá của mỗi sản phẩm là 395,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
        break;
      }
      case 'nam_qj2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/quan-jean-nam-qj-329.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Jean nam QJ-2. Giá của mỗi sản phẩm là 395,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_qt1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/quan-tay-nam-cao-cap-qt-165.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần tây nam QT-1. Giá của mỗi sản phẩm là 225,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_qt2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/quan-tay-nam-cao-cap-qt-163.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần tây nam QT-2. Giá của mỗi sản phẩm là 225,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_qk1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/quan-kaki-nam-qk-86.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Kaki nam QK-1. Giá của mỗi sản phẩm là 350,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_qk2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/quan-kaki-nam-qk-85.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Kaki nam QK-2. Giá của mỗi sản phẩm là 350,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_qsk1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/quan-short-kaki-lung-thun-qsk-380.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Short kaki QSK-1. Giá của mỗi sản phẩm là 160,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_qsk2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/quan-short-kaki-qsk-379.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Short kaki QSK-2. Giá của mỗi sản phẩm là 160,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      //aonam
      case 'nam_at1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/ao-thun-nam-att-2771.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo thun nam AT-1. Giá của mỗi sản phẩm là 180,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_at2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/ao-thun-nam-att-2755.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo thun nam AT-2. Giá của mỗi sản phẩm là 180,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_at3':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/ao-thun-nam-att-2734.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo thun nam AT-3. Giá của mỗi sản phẩm là 180,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_at4':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/ao-thun-nam-att-2568.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo thun nam AT-4. Giá của mỗi sản phẩm là 180,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_sm1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/so-mi-nam-sm-775.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Sơ mi tay dài SM-1. Giá của mỗi sản phẩm là 220,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_sm2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/so-mi-nam-sm-774.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Sơ mi tay dài SM-2. Giá của mỗi sản phẩm là 220,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_sm3':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/so-mi-hoa-tiet-sm-792.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Sơ mi tay ngắn SM-3. Giá của mỗi sản phẩm là 220,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nam_sm4':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "http://kenta.vn/so-mi-hoa-tiet-sm-789.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonam"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Sơ mi tay ngắn SM-4. Giá của mỗi sản phẩm là 220,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      //aonu
      case 'nu_at1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/mau-ao-thun-polo-nu-chat-luong-cao-p3848551.html?src=category-page&spid=3848567"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo thun nữ AT-1. Giá của mỗi sản phẩm là 140,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_at2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/ao-thun-nu-hanh-phuc-xe-dap-p3830117.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo thun nữ AT-2. Giá của mỗi sản phẩm là 90,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_at3':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/ao-thun-nu-hanh-phuc-love-p3829423.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo thun nữ AT-3. Giá của mỗi sản phẩm là 90,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_at4':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/so-mi-cam-hoa-nhi-sm303-p3796355.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo thun nữ AT-4. Giá của mỗi sản phẩm là 90,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_asm1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/so-mi-cam-hoa-nhi-sm303-p3796355.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo sơ mi nữ ASM-1. Giá của mỗi sản phẩm là 199,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_asm2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/so-mi-trang-beo-nguc-sm312-p3795399.html?src=category-pagee"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo sơ mi nữ ASM-2. Giá của mỗi sản phẩm là 199,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_ak1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/ao-kieu-hoa-nhi-tim-than-sm305-p3769155.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo kiểu nữ AK-1. Giá của mỗi sản phẩm là 199,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_ak2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/ao-kieu-croptop-trang-sm310-p3793617.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo kiểu nữ AK-2. Giá của mỗi sản phẩm là 199,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      //quannu
      case 'nu_qj1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/quan-jeans-nu-ong-loe-011-a91-jeans-wflbs011lg-xanh-p845618.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Jean nữ QJ-1. Giá của mỗi sản phẩm là 216,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_qj2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/quan-jeans-nu-boyfriend-rach-chu-s-aaa-jeans-bfmvr-s-xanh-dam-p831894.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Jean nữ QJ-2. Giá của mỗi sản phẩm là 360,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_qk1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/quan-baggy-nu-tho-dui-zavans-p3327123.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Kaki nữ QK-1. Giá của mỗi sản phẩm là 130,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_qk2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/quan-kaki-lung-cao-ong-loe-cuc-ky-quy-phai-100-den-p3103935.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần Kaki nữ QK-2. Giá của mỗi sản phẩm là 170,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_qcv1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/chan-vay-xoe-cirino-ke-soc-hong-p3114239.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần chân váy nữ QCV-1. Giá của mỗi sản phẩm là 349,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_qcv2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/jupe-den-xoe-that-no-cap-tosonfashion-32017b528-p2644855.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần chân váy nữ QCV-2. Giá của mỗi sản phẩm là 190,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_qcv3':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/jupe-den-xoe-that-no-cap-tosonfashion-32017b528-p2644855.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần chân váy nữ QCV-3. Giá của mỗi sản phẩm là 140,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'nu_qcv4':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://tiki.vn/chan-vay-xoe-phoi-tui-p2841123.html?src=category-page"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaonu"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần chân váy nữ QCV-4. Giá của mỗi sản phẩm là 180,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      //quanaobetrai
      case 'betrai_bt1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/set-ao-thun-co-tru-soc-theu-logo-so-1-kem-quan-kaki-de-thuong-cho-be-trai-3-12-tuoi-btb19227-1338970657.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ thun cổ trụ bé trai 3-12 tuổi BT-1. Giá của mỗi sản phẩm là 145,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'betrai_bt2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/bo-dai-tay-the-thao-so-7-de-thuong-cho-be-trai-2-9-tuoi-btb19329.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ thun thể thao bé trai 2-9 tuổi BT-2. Giá của mỗi sản phẩm là 145,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'betrai_bt3':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/size-dai-bo-dai-tay-thun-xuoc-tui-dap-logo-de-thuong-cho-be-trai-9-14-tuoi-btb19321.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ thun dài tay bé trai 2-9 tuổi BT-3. Giá của mỗi sản phẩm là 155,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'betrai_bt4':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/set-ao-thun-co-tru-phoi-soc-strugg-quan-kaki-lung-thun-de-thuong-cho-be-trai-2-12-tuoi-btb19304.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ thun cổ trụ bé trai 9-12 tuổi BT-4. Giá của mỗi sản phẩm là 155,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'betrai_aj1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/ao-so-mi-jeans-theu-huou-de-thuong-cho-be-trai-1-10-tuoi-atb195670.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Áo sơ mi jean bé trai 1-10 tuổi AJ-1. Giá của mỗi sản phẩm là 140,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'betrai_qj1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/quan-jeans-wash-rach-in-chu-k-de-thuong-cho-be-trai-3-10-tuoi-qtb195669.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần jean bé trai 3-10 tuổi QJ-1. Giá của mỗi sản phẩm là 140,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'betrai_qj2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/quan-jeans-wash-rach-hilfiger-de-thuong-cho-be-trai-1-10-tuoi-qtb195637.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Quần jean bé trai 5-10 tuổi QJ-2. Giá của mỗi sản phẩm là 140,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      //quanaobegai
      case 'begai_bt1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/size-dai-bo-thun-sat-nach-so-79-de-thuong-cho-be-9-14-tuoi-btb19336.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ thun bé gái 4-10 tuổi BT-1. Giá của mỗi sản phẩm là 130,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'begai_bt2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/bo-thun-sat-nach-so-79-de-thuong-cho-be-1-8-tuoi-btb19333.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ thun bé gái 4-10 tuổi BT-2. Giá của mỗi sản phẩm là 120,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'begai_bd1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/bo-thun-sat-nach-so-79-de-thuong-cho-be-1-8-tuoi-btb19333.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ đầm bé gái 9-14 tuổi BD-1. Giá của mỗi sản phẩm là 130,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'begai_bc1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/size-dai-bo-dai-tay-cotton-in-cun-de-thuong-cho-be-9-14-tuoi-btb19280.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ dài tay cotton bé gái 9-14 tuổi BC-1. Giá của mỗi sản phẩm là 145,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'begai_bc2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/bo-dai-tay-cotton-in-cun-de-thuong-cho-be-1-8-tuoi-btb19276.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ dài tay cotton bé gái 1-8 tuổi BC-2. Giá của mỗi sản phẩm là 145,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'begai_ba1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/size-dai-bo-ao-non-the-thao-in-xuong-ca-de-thuong-cho-be-gai-10-15-tuoi-bgb117704.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ áo nón thể thao bé gái 10-15 tuổi BA-1. Giá của mỗi sản phẩm là 140,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'begai_ba2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.bexinhshop.vn/bo-ao-non-the-thao-in-xuong-ca-de-thuong-cho-be-gai-2-9-tuoi-bgb117702.html"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovequanaotreem"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Bộ áo nón thể thao bé gái 2-9 tuổi BA-2. Giá của mỗi sản phẩm là 140,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      //giaydep
      case 'gna1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://mwc.com.vn/products/giay-the-thao-nam-mwc-natt---5138?c=X%C3%81M"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Giày thể thao nam GNA-1. Giá của mỗi sản phẩm là 250,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'gna2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://mwc.com.vn/products/giay-the-thao-nam-mwc-natt---5135?c=%C4%90EN"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Giày thể thao nam GNA-2. Giá của mỗi sản phẩm là 270,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'gna3':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://mwc.com.vn/products/giay-slipon-nam-mwc-nasl--6045?c=%C4%90EN"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Giày thể thao nam GNA-3. Giá của mỗi sản phẩm là 270,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'gna4':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://mwc.com.vn/products/giay-moi-nam-mwc-namo--6560?c=XANH%C4%90"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Giày thể thao nam GNA-4. Giá của mỗi sản phẩm là 235,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'gn1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://mwc.com.vn/products/giay-moi-nam-mwc-namo--6560?c=XANH%C4%90"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Giày thể thao nữ GN-1. Giá của mỗi sản phẩm là 250,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'gn2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://mwc.com.vn/products/giay-the-thao-nu-mwc-nutt--0226?c=%C4%90EN"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Giày thể thao nữ GN-2. Giá của mỗi sản phẩm là 215,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'gn3':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://mwc.com.vn/products/giay-the-thao-nu-mwc-nutt--0225?c=%C4%90EN"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Giày thể thao nữ GN-3. Giá của mỗi sản phẩm là 250,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      case 'gn4':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://mwc.com.vn/products/giay-the-thao-nu-mwc-nutt--0225?c=%C4%90EN"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Giày thể thao nữ GN-4. Giá của mỗi sản phẩm là 235,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'))
          break;
      }
      //munon
      case 'mlt1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.lazada.vn/products/non-duoi-dai-non-ket-duoi-dai-mu-luoi-trai-duoi-dai-den-vang-trang-i219013267-s274919607.html?spm=a2o4n.searchlistcategory.list.1.2ea81dcenX79u9&search=1"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Mũ lưỡi trai MLT-1. Giá của mỗi sản phẩm là 52,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'));
          break;
      }
      case 'mlt2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.lazada.vn/products/non-ketnon-luoi-traimu-non-gc-thoi-trang-i221812940-s279068388.html?spm=a2o4n.searchlistcategory.list.15.2ea81dcenX79u9&search=1"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Mũ lưỡi trai MLT-2. Giá của mỗi sản phẩm là 35,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'));
          break;
      }
      case 'mlt3':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.lazada.vn/products/san-pham-freeship-nhap-ma-giam500k-giam-20-td-500k-non-tron-thoi-trang-k-t-den-i101882619-s102230583.html?spm=a2o4n.searchlistcategory.list.19.2ea81dcenX79u9&search=1"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Mũ lưỡi trai MLT-3. Giá của mỗi sản phẩm là 18,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'));
          break;
      }
      case 'mlt4':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.lazada.vn/products/non-ket-vai-du-thoi-trang-do-vien-den-i211121838-s264218670.html?spm=a2o4n.searchlistcategory.list.31.2ea81dcenX79u9&search=1"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Mũ lưỡi trai MLT-4. Giá của mỗi sản phẩm là 28,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'));
          break;
      }
      case 'mv1':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.lazada.vn/products/non-bucketnon-vanhmu-vanh-gdragon-i221626045-s278713396.html?spm=a2o4n.searchlistcategory.list.6.2ea81dcenX79u9&search=1"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Mũ vành MV-1. Giá của mỗi sản phẩm là 42,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'));
          break;
      }
      case 'mv2':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.lazada.vn/products/non-bucketnon-vanhmu-vanh-off-white-nam-nu-i216843832-s283384182.html?spm=a2o4n.searchlistcategory.list.83.2ea81dcenX79u9&search=1"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Mũ vành MV-2. Giá của mỗi sản phẩm là 42,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'));
          break;
      }
      case 'mv3':{
        var confirm=function(text){
          return {
            "attachment":{
              "type":"template",
              "payload":{
                  "template_type":"button",
                  "text": text,
                  "buttons":[
                    {
                      "title": "Có",
                      "type": "web_url",
                      "url": "https://www.lazada.vn/products/non-bucketnon-tai-beonon-vanh-champion-thoi-trang-han-quoc-i221874576-s279185170.html?spm=a2o4n.searchlistcategory.list.163.2ea81dcenX79u9&search=1"
                    },
                    {
                        "type":"postback",
                        "title":"Không",
                        "payload":"trovephukien"
                    }
                  ]
              }
            }
          }
         }
         sendMessage(senderId,confirm('Quý khách vừa lựa chọn sản phẩm Mũ vành MV-3. Giá của mỗi sản phẩm là 42,000 VND. Nếu muốn đặt hàng quý khách vui lòng chọn Có hoặc Không để trở về. Xin cảm ơn <3'));
      }
     } 
  }
}


function processMessage(event){
  var message = event.message.text;
  var senderId = event.sender.id;
  if (!event.message.is_echo) {
    if(message.match(/chao/i)||message.match(/hi/i)||message.match(/chào/i)||message.match(/2/i)||message.match(/hello/i)){
      sendMessage(senderId,menu('Em xin chào ạ :P. Xin mời quý khách lựa chọn!'));
    }
    else if(message.match(/quan/ig)||message.match(/quần/ig)){
      sendMessage(senderId,{text:'Không biết đây có phải quý khách đang tìm không?'})
      sendMessage(senderId,quannam());
      sendMessage(senderId,quannu());
    }
    else if(message.match(/ao/ig)||message.match(/áo/gi)){
      sendMessage(senderId,{text:'Xin mời quý khách tham khảo <3'})
      sendMessage(senderId,aonam());
      sendMessage(senderId,aonu());
    }
    else if(message.match(/nam/i)){
      sendMessage(senderId,{text:'Xin mời quý khách tham khảo <3'})
      sendMessage(senderId,aonam());
      sendMessage(senderId,quannam());
    }
    else if(message.match(/nu/i)||message.match(/nữ/i)){
      sendMessage(senderId,{text:'Xin mời quý khách tham khảo <3'})
      sendMessage(senderId,aonam());
      sendMessage(senderId,quannam());
    }
    else if(message.match(/tre em/i)||message.match(/trẻ em/i)){
      sendMessage(senderId,{text:'Xin mời quý khách tham khảo <3'})
      sendMessage(senderId,quanaotreem());
    }
    else if(message.match(/bé trai/i)||message.match(/be trai/i)||message.match(/trai/i)){
      sendMessage(senderId,{text:'Mời tham khảo nè :P'})
      sendMessage(senderId,quanaobetrai());
    }
    else if(message.match(/bé gái/i)||message.match(/be gai/i)||message.match(/gai/i)){
      sendMessage(senderId,{text:'Mời tham khảo nè :P'})
      sendMessage(senderId,quanaobegai());
    }
    else if(message.match(/mũ/i)||message.match(/mu/i)||message.match(/nón/i)||message.match(/non/i)){
      sendMessage(senderId,{text:'Mời tham khảo ạ :8'})
      sendMessage(senderId,munon());
    }
    else if(message.match(/giày/i)||message.match(/dép/i)||message.match(/giay/i)||message.match(/dep/i)){
      sendMessage(senderId,{text:'Mời tham khảo ạ :8'})
      sendMessage(senderId,giaydep());
    }
    else if(message.match(/de thuong/i||message.match(/dễ thương/i)||message.match(/dang yeu/i)||message.match(/đáng yêu/i)||message.match(/thong minh/i)||message.match(/thông minh/i))){
      sendMessage(senderId,{text:'Dạ em xin cảm ơn ạ <3'});
    }
    else if(message.match(/de thuong/i||message.match(/dễ thương/i)||message.match(/dang yeu/i)||message.match(/đáng yêu/i)||message.match(/thong minh/i)||message.match(/thông minh/i))){
        sendMessage(senderId,{text:'Dạ em xin cảm ơn ạ <3'});
      }
    else{
      sendMessage(senderId,{text:'Xin lỗi quý khách em không biết ạ'});
      sendMessage(senderId,menu('Quý khách có thể tham khảo bên dưới ạ!'));
    }
  }
}

const menu = (text) => {
    return {
    "attachment":{
      "type":"template",
      "payload":{
          "template_type":"button",
          "text": text,
          "buttons":[
            {
                "type":"postback",
                "title":"Quần áo nam nữ",
                "payload":"quanaonamnu"
            },
            {
                "type":"postback",
                "title":"Quần áo trẻ em",
                "payload":"quanaotreem"
            },
            {
              "type":"postback",
              "title":"Phụ kiện",
              "payload":"phukien"
            }
          ]
      }
    }
  }
}


 const quanaonamnu= function(){
   return{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Xin chào",
            "image_url":"http://khoquanaosi.com/wp-content/uploads/2018/08/z1079469133407_77182c979404953dc556dca6823fa5b7-247x300.jpg",
            "subtitle":"Chúng tôi có quần áo nam nữ các loại.",
            "buttons":[
              {
                "type":"postback",
                "title":"Quần áo nam",
                "payload":"quanaonam"
              },
              {
                "type":"postback",
                "title":"Quần áo nữ",
                "payload":"quanaonu"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovemenu"
              }          
            ]      
          }
        ]
      }
    }
  }
}

const quanaotreem= function(){
  return{
   "attachment":{
     "type":"template",
     "payload":{
       "template_type":"generic",
       "elements":[
          {
           "title":"Xin chào",
           "image_url":"https://vinakids.vn/hinhanh/tintuc/cach-chon-size-quan-ao-tre-em-phu-hop-voi-tre-1.jpg",
           "subtitle":"Chúng tôi có quần áo trẻ em các loại.",
           "buttons":[
             {
               "type":"postback",
               "title":"Quần áo bé trai",
               "payload":"quanaobetrai"
             },
             {
               "type":"postback",
               "title":"Quần áo bé gái",
               "payload":"quanaobegai"
             },
             {
               "type":"postback",
               "title":"Trở về",
               "payload":"trovemenu"
             }          
           ]      
         }
       ]
     }
   }
 }
}


const phukien= function(text){
  return{
    "attachment":{
      "type":"template",
      "payload":{
          "template_type":"button",
          "text": text,
          "buttons":[
            {
                "type":"postback",
                "title":"Mũ nón",
                "payload":"munon"
            },
            {
                "type":"postback",
                "title":"Giày dép",
                "payload":"giaydep"
            },
            {
              "type":"postback",
              "title":"Trở về",
              "payload":"trovemenu"
          }
          ]
      }
    }
  }
}

const quanaonam= (text) => {
  return {
      "attachment":{
          "type":"template",
          "payload":{
              "template_type":"button",
              "text": text,
              "buttons":[
                {
                    "type":"postback",
                    "title":"Áo nam",
                    "payload":"aonam"
                },
                {
                    "type":"postback",
                    "title":"Quần nam",
                    "payload":"quannam"
                },
                {
                  "type":"postback",
                  "title":"Trở về",
                  "payload":"trovequanaonamnu"
                }
              ]
          }
      }
  }
}

const quanaonu= (text) => {
  return {
      "attachment":{
          "type":"template",
          "payload":{
              "template_type":"button",
              "text": text,
              "buttons":[
                {
                    "type":"postback",
                    "title":"Áo nữ",
                    "payload":"aonu"
                },
                {
                    "type":"postback",
                    "title":"Quần nữ",
                    "payload":"quannu"
                },
                {
                  "type":"postback",
                  "title":"Trở về",
                  "payload":"trovequanaonamnu"
                }
              ]
          }
      }
  }
}

/******************** QUẦN NAM **********************/
const quannam = function(){
  return{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Quần Jean nam QJ-1",
            "subtitle":"Giá: 395,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-08-09/quanjean/thumbs/(233x311)_quan_jean_0045.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_qj1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/quan-jean-nam-qj-332.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Quần Jean nam QJ-2",
            "subtitle":"Giá: 395,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-08-09/quanjean/thumbs/(233x311)_quan_jean_0041.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_qj2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/quan-jean-nam-qj-329.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Quần tây nam cao cấp QT-1",
            "subtitle":"Giá: 255,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-07-19/quantay/thumbs/(233x311)_quan_tay_nam_0017.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_qt1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/quan-tay-nam-cao-cap-qt-165.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Quần tây nam cao cấp QT-2",
            "subtitle":"Giá: 255,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-07-19/quantay/thumbs/(233x311)_quan_tay_nam_0009.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_qt2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/quan-tay-nam-cao-cap-qt-163.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Quần Kaki nam QK-1",
            "subtitle":"Giá: 350,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-08-09/kaki/thumbs/(233x311)_quan_kaki_0009.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_qk1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/quan-kaki-nam-qk-86.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Quần Kaki nam QK-2",
            "subtitle":"Giá: 350,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-08-09/kaki/thumbs/(233x311)_quan_kaki_0005.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_qk2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/quan-kaki-nam-qk-85.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Quần Short kaki QSK-1",
            "subtitle":"Giá: 160,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-08-09/quanshort/thumbs/(233x311)_quan_short_0021.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_qsk1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/quan-short-kaki-lung-thun-qsk-380.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Quần Short kaki QSK-2",
            "subtitle":"Giá: 160,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-08-09/quanshort/thumbs/(233x311)_quan_short_0017.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_qsk2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/quan-short-kaki-qsk-379.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
        ]
      }
    }
  }
}
  
/************************* ÁO NAM ******************************/

const aonam= function(){
  return{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Áo thun nam AT-1",
            "subtitle":"Giá: 180,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-05-22/thun2/thumbs/(233x311)_ao_thun_nam_0085.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_at1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/ao-thun-nam-att-2771.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Áo thun nam AT-2",
            "subtitle":"Giá: 180,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-05-22/thun2/thumbs/(233x311)_ao_thun_nam_0021.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_at2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/ao-thun-nam-att-2755.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          },
          {
            "title":"Áo thun nam AT-3",
            "subtitle":"Giá: 180,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-05-22/thun1/thumbs/(233x311)_ao_thun_nam_0017.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_at3"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/ao-thun-nam-att-2734.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Áo thun nam AT-4",
            "subtitle":"Giá: 180,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-03-23/thun3/thumbs/(233x311)_ao_thun_nam_0009.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_at4"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/ao-thun-nam-att-2568.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Sơ mi tay dài SM-1",
            "subtitle":"Giá: 220,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-07-19/somi/thumbs/(233x311)_so_mi_nam_0018.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_sm1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/so-mi-nam-sm-775.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Sơ mi tay dài SM-2",
            "subtitle":"Giá: 220,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-07-19/somi/thumbs/(233x311)_so_mi_nam_0014.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_sm2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/so-mi-nam-sm-774.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Sơ mi tay ngắn SM-3",
            "subtitle":"Giá: 220,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-07-19/somitn/thumbs/(233x311)_so_mi_tay_ngan_0065.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_sm3"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/so-mi-hoa-tiet-sm-792.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }, 
          {
            "title":"Sơ mi tay ngắn SM-4",
            "subtitle":"Giá: 220,000 VND",
            "image_url":"http://kenta.vn/vnt_upload/product/2018-07-19/somitn/thumbs/(233x311)_so_mi_tay_ngan_0053.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nam_sm4"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "http://kenta.vn/so-mi-hoa-tiet-sm-789.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonam"
              }
            ]      
          }
        ]
      }
    }
  }
}          

/**************************** ÁO NỮ **************************/


const aonu= function(){
  return{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Áo thun nữ AT-1",
            "subtitle":"Giá: 140,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/84/a1/90/f1d0aaae0cdade6f3acfd166dd5650eb.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_at1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/mau-ao-thun-polo-nu-chat-luong-cao-p3848551.html?src=category-page&spid=3848567"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          }, 
          {
            "title":"Áo thun nữ AT-2",
            "subtitle":"Giá: 90,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/6f/d8/6f/3ef2957ccf7dafba87be1cd56c4471d2.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_at2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/ao-thun-nu-hanh-phuc-xe-dap-p3830117.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Áo thun nữ AT-3",
            "subtitle":"Giá: 90,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/9c/f3/10/23c9ac2fb117aa84d73d87e8431470ae.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_at3"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/ao-thun-nu-hanh-phuc-love-p3829423.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Áo thun nữ AT-4",
            "subtitle":"Giá: 90,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/5d/98/15/8ed327eaf9089317bbd0064b75ee4ae3.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_at4"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/so-mi-cam-hoa-nhi-sm303-p3796355.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Áo sơ mi nữ ASM-1",
            "subtitle":"Giá: 199,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/ff/e6/32/80d3d87fc3c1161b8d2be15d97a0d5d8.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_asm1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/so-mi-cam-hoa-nhi-sm303-p3796355.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Áo sơ mi nữ ASM-2",
            "subtitle":"Giá: 199,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/ba/9f/14/bc97e56ef8b45d2650f4ff3b1832483d.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_asm2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/so-mi-trang-beo-nguc-sm312-p3795399.html?src=category-pagee"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Áo kiểu nữ AK-1",
            "subtitle":"Giá: 199,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/63/78/9b/e84c0da80b71cabf3e1d61e1a9264eb2.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_ak1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/ao-kieu-hoa-nhi-tim-than-sm305-p3769155.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Áo kiểu nữ AK-2",
            "subtitle":"Giá: 199,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/44/16/5a/c57448c1b6ae812af86cd2c4ca6a827c.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_ak2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/ao-kieu-croptop-trang-sm310-p3793617.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          }
        ]
      }
    }
  }
}          
  

/************************ QUẦN NỮ ***********************/
const quannu= function(){
  return{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Quần Jean nữ QJ-1",
            "subtitle":"Giá: 216,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/media/catalog/product/1/_/1.u5530.d20170824.t165722.759320_2.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_qj1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/quan-jeans-nu-ong-loe-011-a91-jeans-wflbs011lg-xanh-p845618.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Quần Jean nữ QJ-2",
            "subtitle":"Giá: 360,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/media/catalog/product/1/_/1.u4064.d20170821.t175549.354924.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_qj2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/quan-jeans-nu-boyfriend-rach-chu-s-aaa-jeans-bfmvr-s-xanh-dam-p831894.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Quần Kaki nữ QK-1",
            "subtitle":"Giá: 130,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/47/f4/55/200bb99114caaed45177455becd576de.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_qk1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/quan-baggy-nu-tho-dui-zavans-p3327123.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Quần Kaki nữ QK-2",
            "subtitle":"Giá: 170,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/fb/02/f4/55737cf0f841a4b21f9d9cbbd4709bb1.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_qk2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/quan-kaki-lung-cao-ong-loe-cuc-ky-quy-phai-100-den-p3103935.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Quần chân váy nữ QCV-1",
            "subtitle":"Giá: 349,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/de/b7/3e/a27d6cd6397cbf4a02c6df01c9d48c34.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_qcv1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/chan-vay-xoe-cirino-ke-soc-hong-p3114239.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Quần chân váy nữ QCV-2",
            "subtitle":"Giá: 190,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/cd/5c/4b/145359e0c379c73bdf568e367115306d.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_qcv2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/jupe-den-xoe-that-no-cap-tosonfashion-32017b528-p2644855.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Quần chân váy nữ QCV-3",
            "subtitle":"Giá: 140,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/53/9d/92/41810c8c438e3db6148f09aef1402365.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_qcv3"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/jupe-den-xoe-that-no-cap-tosonfashion-32017b528-p2644855.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
          {
            "title":"Quần chân váy nữ QCV-4",
            "subtitle":"Giá: 180,000 VND",
            "image_url":"https://vcdn.tikicdn.com/cache/200x296/ts/product/bd/21/f8/c14e9bcc522655702fed36888f1adf24.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"nu_qcv4"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://tiki.vn/chan-vay-xoe-phoi-tui-p2841123.html?src=category-page"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaonu"
              }
            ]      
          },
        ]
      }
    }
  }
}   

/*********************** QUẦN ÁO BÉ TRAI ********************* */
const quanaobetrai= function(){
  return{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Bộ thun cổ trụ bé trai 3-12 tuổi BT-1",
            "subtitle":"Giá: 145,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/30-6-2018/SETTHUNSO1.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"betrai_bt1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/set-ao-thun-co-tru-soc-theu-logo-so-1-kem-quan-kaki-de-thuong-cho-be-trai-3-12-tuoi-btb19227-1338970657.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ thun thể thao bé trai 2-9 tuổi BT-2",
            "subtitle":"Giá: 145,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/BOSO7XANH.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"betrai_bt2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/bo-dai-tay-the-thao-so-7-de-thuong-cho-be-trai-2-9-tuoi-btb19329.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ thun dài tay bé trai 2-9 tuổi BT-3",
            "subtitle":"Giá: 155,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/BODAITAYXUOCLOGOdo.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"betrai_bt3"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/size-dai-bo-dai-tay-thun-xuoc-tui-dap-logo-de-thuong-cho-be-trai-9-14-tuoi-btb19321.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ thun cổ trụ bé trai 9-12 tuổi BT-4",
            "subtitle":"Giá: 155,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/BOSTRUGGDO.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"betrai_bt4"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/set-ao-thun-co-tru-phoi-soc-strugg-quan-kaki-lung-thun-de-thuong-cho-be-trai-2-12-tuoi-btb19304.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Áo sơ mi jean bé trai 1-10 tuổi AJ-1",
            "subtitle":"Giá: 140,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/aosomihuou.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"betrai_aj1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/ao-so-mi-jeans-theu-huou-de-thuong-cho-be-trai-1-10-tuoi-atb195670.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Áo thun cổ trụ bé trai 1-10 tuổi AT-1",
            "subtitle":"Giá: 95,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/23-12-2017/aosoccotrutrang.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"betrai_at1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/ao-thun-soc-co-tru-de-thuong-cho-be-trai-1-8-tuoi-atb195503.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Quần jean bé trai 3-10 tuổi QJ-1",
            "subtitle":"Giá: 140,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/quanjeansk.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"betrai_qj1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/quan-jeans-wash-rach-in-chu-k-de-thuong-cho-be-trai-3-10-tuoi-qtb195669.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Quần jean bé trai 5-10 tuổi QJ-2",
            "subtitle":"Giá: 140,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/22-6-2018/quanjeanshelifxanh.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"betrai_qj2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/quan-jeans-wash-rach-hilfiger-de-thuong-cho-be-trai-1-10-tuoi-qtb195637.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          }
        ]
      }
    }
  }
} 
/*********************** QUẦN ÁO BÉ GÁI ********************** */

const quanaobegai= function(){
  return{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Bộ thun bé gái 4-10 tuổi BT-1",
            "subtitle":"Giá: 130,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/boso79vang.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"begai_bt1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/size-dai-bo-thun-sat-nach-so-79-de-thuong-cho-be-9-14-tuoi-btb19336.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ thun bé gái 4-10 tuổi BT-2",
            "subtitle":"Giá: 120,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/boso79trang.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"begai_bt2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/bo-thun-sat-nach-so-79-de-thuong-cho-be-1-8-tuoi-btb19333.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ đầm bé gái 9-14 tuổi BD-1",
            "subtitle":"Giá: 130,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/DAMBEOTAYXANH.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"begai_bd1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/size-dai-dam-tay-beo-caro-de-thuong-cho-be-gai-9-14-tuoi-dgb190616.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ đầm bé gái 1-8 tuổi BD-2",
            "subtitle":"Giá: 120,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/DAMBEOTAYHONG.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"begai_bd2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/dam-tay-beo-caro-de-thuong-cho-be-gai-1-8-tuoi-dgb190614.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ dài tay cotton bé gái 9-14 tuổi BC-1",
            "subtitle":"Giá: 145,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/15-7-2018/BODAITAYCUNNAU.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"begai_bc1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/size-dai-bo-dai-tay-cotton-in-cun-de-thuong-cho-be-9-14-tuoi-btb19280.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ dài tay cotton bé gái 1-8 tuổi BC-2",
            "subtitle":"Giá: 145,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/15-7-2018/BODAITAYCUNVANG.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"begai_bc2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/bo-dai-tay-cotton-in-cun-de-thuong-cho-be-1-8-tuoi-btb19276.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ áo nón thể thao bé gái 10-15 tuổi BA-1",
            "subtitle":"Giá: 140,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/BOAONONXUONGCADEN.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"begai_ba1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/size-dai-bo-ao-non-the-thao-in-xuong-ca-de-thuong-cho-be-gai-10-15-tuoi-bgb117704.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          },
          {
            "title":"Bộ áo nón thể thao bé gái 2-9 tuổi BA-2",
            "subtitle":"Giá: 140,000 VND",
            "image_url":"https://www.bexinhshop.vn/image/data/4-8-2018/BOAONONXUONGCADO.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"begai_ba2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.bexinhshop.vn/bo-ao-non-the-thao-in-xuong-ca-de-thuong-cho-be-gai-2-9-tuoi-bgb117702.html"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovequanaotreem"
              }
            ]      
          }
        ]
      }
    }
  }
} 


/*********************** GIÀY DÉP *************************** */

const giaydep= function(){
  return{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Giày thể thao nam GNA-1",
            "subtitle":"Giá: 250,000 VND",
            "image_url":"http://img.mwc.com.vn/giay-thoi-trang?&w=450&h=450&FileInput=/Upload/2018/07/37557680-1720769911310811-718261592956862464-n.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"gna1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://mwc.com.vn/products/giay-the-thao-nam-mwc-natt---5138?c=X%C3%81M"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Giày thể thao nam GNA-2",
            "subtitle":"Giá: 270,000 VND",
            "image_url":"http://img.mwc.com.vn/giay-thoi-trang?&w=450&h=450&FileInput=/Upload/2018/06/36223873-1686432504744552-7209540297863200768-n-grande.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"gna2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://mwc.com.vn/products/giay-the-thao-nam-mwc-natt---5135?c=%C4%90EN"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Giày slipon nam GNA-3",
            "subtitle":"Giá: 270,000 VND",
            "image_url":"http://img.mwc.com.vn/giay-thoi-trang?&w=450&h=450&FileInput=/Upload/2018/08/38137291-1739776739410128-3742009854575771648-n.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"gna3"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://mwc.com.vn/products/giay-slipon-nam-mwc-nasl--6045?c=%C4%90EN"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Giày mọi nam GNA-4",
            "subtitle":"Giá: 235,000 VND",
            "image_url":"http://img.mwc.com.vn/giay-thoi-trang?&w=450&h=450&FileInput=/Upload/2018/06/35963852-1679313705456432-6124339385153355776-n-grande.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"gna4"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://mwc.com.vn/products/giay-moi-nam-mwc-namo--6560?c=XANH%C4%90"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Giày thể thao nữ GN-1",
            "subtitle":"Giá: 250,000 VND",
            "image_url":"http://img.mwc.com.vn/giay-thoi-trang?&w=450&h=450&FileInput=//Upload/2018/08/tb2a2mqjxgwbunjy0fbxxb4sxxa-2817468503.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"gn1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://mwc.com.vn/products/giay-moi-nam-mwc-namo--6560?c=XANH%C4%90"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Giày thể thao nữ GN-2",
            "subtitle":"Giá: 215,000 VND",
            "image_url":"http://img.mwc.com.vn/giay-thoi-trang?&w=450&h=450&FileInput=//Upload/2018/08/39102222-231301867576086-5424975442140463104-n.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"gn2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://mwc.com.vn/products/giay-the-thao-nu-mwc-nutt--0226?c=%C4%90EN"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Giày thể thao nữ GN-3",
            "subtitle":"Giá: 250,000 VND",
            "image_url":"http://img.mwc.com.vn/giay-thoi-trang?&w=450&h=450&FileInput=//Upload/2018/08/39344538-432279487260935-4593903496612282368-n.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"gn3"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://mwc.com.vn/products/giay-the-thao-nu-mwc-nutt--0225?c=%C4%90EN"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Giày thể thao nữ GN-4",
            "subtitle":"Giá: 235,000 VND",
            "image_url":"http://img.mwc.com.vn/giay-thoi-trang?&w=450&h=450&FileInput=//Upload/2018/08/39027496-2151561514885699-5630977106042159104-n.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"gn4"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://mwc.com.vn/products/giay-the-thao-nu-mwc-nutt--0223?c=H%E1%BB%92NG"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          }
        ]
      }
    }
  }
} 
       

/************************* MŨ NÓN ****************************** */
const munon= function(){
  return{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Mũ lưỡi trai MLT-1",
            "subtitle":"Giá: 52,000 VND",
            "image_url":"https://vn-live-02.slatic.net/original/2aa87c3e7096986adb4c5d0f08368433.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"mlt1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.lazada.vn/products/non-duoi-dai-non-ket-duoi-dai-mu-luoi-trai-duoi-dai-den-vang-trang-i219013267-s274919607.html?spm=a2o4n.searchlistcategory.list.1.2ea81dcenX79u9&search=1"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Mũ lưỡi trai MLT-2",
            "subtitle":"Giá: 35,000 VND",
            "image_url":"https://vn-live-02.slatic.net/original/359861fdc6d80b166d3ad709a63d3f3e.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"mlt2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.lazada.vn/products/non-ketnon-luoi-traimu-non-gc-thoi-trang-i221812940-s279068388.html?spm=a2o4n.searchlistcategory.list.15.2ea81dcenX79u9&search=1"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Mũ lưỡi trai MLT-3",
            "subtitle":"Giá: 18,000 VND",
            "image_url":"https://vn-live-02.slatic.net/original/ad83a0a632140b1a208a92740faab55c.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"mlt3"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.lazada.vn/products/san-pham-freeship-nhap-ma-giam500k-giam-20-td-500k-non-tron-thoi-trang-k-t-den-i101882619-s102230583.html?spm=a2o4n.searchlistcategory.list.19.2ea81dcenX79u9&search=1"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Mũ lưỡi trai MLT-4",
            "subtitle":"Giá: 28,000 VND",
            "image_url":"https://vn-live-02.slatic.net/original/a3361d6b2e33f9619293a308b8dbfce4.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"mlt4"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.lazada.vn/products/non-ket-vai-du-thoi-trang-do-vien-den-i211121838-s264218670.html?spm=a2o4n.searchlistcategory.list.31.2ea81dcenX79u9&search=1"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Mũ vành MV-1",
            "subtitle":"Giá: 42,000 VND",
            "image_url":"https://vn-live-02.slatic.net/original/18907d8b1b235b3714d3c108f8278bb2.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"mv1"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.lazada.vn/products/non-bucketnon-vanhmu-vanh-gdragon-i221626045-s278713396.html?spm=a2o4n.searchlistcategory.list.6.2ea81dcenX79u9&search=1"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Mũ vành MV-2",
            "subtitle":"Giá: 42,000 VND",
            "image_url":"https://vn-live-02.slatic.net/original/a612960f5cd3d3cbdd285d1d37381c66.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"mv2"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.lazada.vn/products/non-bucketnon-vanhmu-vanh-off-white-nam-nu-i216843832-s283384182.html?spm=a2o4n.searchlistcategory.list.83.2ea81dcenX79u9&search=1"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
          {
            "title":"Mũ vành MV-3",
            "subtitle":"Giá: 42,000 VND",
            "image_url":"https://vn-live-02.slatic.net/original/5539bcdb1d3b25c08f98810fb015af7c.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"Đặt hàng",
                "payload":"mv3"
              },
              {
                "title": "Xem thêm",
                "type": "web_url",
                "url": "https://www.lazada.vn/products/non-bucketnon-tai-beonon-vanh-champion-thoi-trang-han-quoc-i221874576-s279185170.html?spm=a2o4n.searchlistcategory.list.163.2ea81dcenX79u9&search=1"
              },
              {
                "type":"postback",
                "title":"Trở về",
                "payload":"trovephukien"
              }
            ]      
          },
        ]
      }
    }
  }
} 