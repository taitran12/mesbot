curl -X POST -H "Content-Type: application/json" -d '
{
    "get_started":{
        "payload":"Get_Started"
    }

}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAADtOBSDIs0BAKZALTuAPHOQZAzcJMz7ZAnVRfnzoIDXNhKBcCYIySlaEXUc5O9I4nAJkiLzF1zWXboeznxdhZBkj1ttshvgtuAK13oTGIrb9w6jYwZBQjLzk4K64isdElUH8A5OwvNE8ZCU76WACtXOJMYhuLHZAmfPaDDOu0mxwhrNGRfVotl"
sleep 1
curl -X POST -H "Content-Type: application/json" -d '{
    "persistent_menu":[
      {
        "locale":"default",
        "composer_input_disabled": false,
        "call_to_actions":[
          {
            "title":"Quần áo nam nữ",
            "type":"nested",
            "call_to_actions":[
              {
                "title":"Quần áo nam",
                "type":"nested",
                "call_to_actions":[
                  {
                    "title":"Áo nam",
                    "type":"postback",
                    "payload":"aonam"
                  },
                  {
                    "title":"Quần nam",
                    "type":"postback",
                    "payload":"quannam"
                  }
                ]
              },
              {
                "title":"Quần áo nữ",
                "type":"nested",
                "call_to_actions":[
                    {
                      "title":"Áo nữ",
                      "type":"postback",
                      "payload":"aonu"
                    },
                    {
                      "title":"Quần nữ",
                      "type":"postback",
                      "payload":"quannu"
                    }
                  ]
              }
            ]
          },
          {
            "title":"Quần áo trẻ em",
            "type":"nested",
            "call_to_actions":[
                {
                  "title":"Quần áo bé trai",
                  "type":"postback",
                  "payload":"quanaobetrai"
                },
                {
                  "title":"Quần áo bé gái",
                  "type":"postback",
                  "payload":"quanaobegai"
                }
              ]
          },
          {
            "title":"Phụ kiện",
            "type":"nested",
            "call_to_actions":[
                {
                  "title":"Mũ nón",
                  "type":"postback",
                  "payload":"munon"
                },
                {
                  "title":"Giày dép",
                  "type":"postback",
                  "payload":"giaydep"
                }
              ]
          }
        ]
      }
    ]
    
  }' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAADtOBSDIs0BAKZALTuAPHOQZAzcJMz7ZAnVRfnzoIDXNhKBcCYIySlaEXUc5O9I4nAJkiLzF1zWXboeznxdhZBkj1ttshvgtuAK13oTGIrb9w6jYwZBQjLzk4K64isdElUH8A5OwvNE8ZCU76WACtXOJMYhuLHZAmfPaDDOu0mxwhrNGRfVotl"