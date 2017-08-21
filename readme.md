working on it

### Input

```less
rn-config {
    arguments: CommonStyles, ThatStyles;
}

Navbar {
    .container1 {
        flex-direction: "CommonStyles.a.b";
        align-items: ThatStyles.a.c;
        .container2 {
            width: 80;
            padding-top: 7;
            padding-bottom: 10;
            .container3 {
                width: 80;
                padding: 7 0 10 0;                
            }
        }
    }
    .triangle {
        border-top-width: 5;
        border-left-width: 5;
        border-right-width: 5;
        border-top-color: orange;
        border-left-color: transparent;
        border-right-color: transparent;
        background-color: transparent;
    }
}

.b {
    border: none;
    .c {
        color: red;
    }
}
```

### Output
```javascript
const { StyleSheet } = require('react-native');
module.exports= function(CommonStyles, ThatStyles){
    return {
        "default": {
            "b": [
                {
                    "style": StyleSheet.create({
                        "border": "none"
                    })
                }
            ],
            "c": [
                {
                    "selectors": [
                        "b"
                    ],
                    "style": StyleSheet.create({
                        "color": "red"
                    })
                }
            ]
        },
        "Navbar": {
            "container1": [
                {
                    "style": StyleSheet.create({
                        "flexDirection": CommonStyles.a.b,
                        "alignItems": ThatStyles.a.c
                    })
                }
            ],
            "container2": [
                {
                    "selectors": [
                        "container1"
                    ],
                    "style": StyleSheet.create({
                        "width": 80,
                        "paddingTop": 7,
                        "paddingBottom": 10
                    })
                }
            ],
            "container3": [
                {
                    "selectors": [
                        "container2",
                        "container1"
                    ],
                    "style": StyleSheet.create({
                        "width": 80,
                        "paddingTop": 7,
                        "paddingRight": 0,
                        "paddingBottom": 10,
                        "paddingLeft": 0
                    })
                }
            ],
            "triangle": [
                {
                    "style": StyleSheet.create({
                        "borderTopWidth": 5,
                        "borderLeftWidth": 5,
                        "borderRightWidth": 5,
                        "borderTopColor": "orange",
                        "borderLeftColor": "transparent",
                        "borderRightColor": "transparent",
                        "backgroundColor": "transparent"
                    })
                }
            ]
        }
    }
}
```