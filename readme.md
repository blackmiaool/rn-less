# rn-less

Write react-native style with less.

``` less
rn-config{//style's config
    arguments: containerMargin,bgColor;//arguments used in less
}
CardExampleStyle {
    .render-title{
        flex: 1;
        align-items: center;
        margin-top: 20;
        .title-text{
            font-size: 20
        }
    }
    .container {
        flex: 1;
        margin-top: containerMargin;// use the variable declared above
        margin-bottom: "containerMargin";// use the variable with string
        .title {
            font-size: "containerMargin/2";// and any expression starts with variable name
            background-color: bgColor;
        }
    }
}
```

```jsx
import { rnLess } from 'rn-less/runtime';// import the decorator
import style from './a.less.js'; // impoprt the style

const rootStyle = style({containerMargin,bgColor});// get the style object

//decorate the component with the style
@rnLess(rootStyle.CardExampleStyle)
class CardExample extends Component {
    //use class names in the less file as style string
    _renderTitle(title) {
        // function invoking is processed, but stateless is not
        return (
            <View style="render-title">
                <Text style="title-text">{title}</Text>
            </View>
        )
    }

    render() {
        return (
            <ScrollView>
                <View style="container">                    
                    {this._renderTitle('Basic')}
                    <Card>
                        <CardTitle>
                            <Text style={["title"]}>Card Title</Text>
                        </CardTitle>
                    </Card>
                </View>
            </ScrollView>
        )
    }
}
```