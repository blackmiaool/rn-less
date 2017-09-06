# rn-less

Style react-native with less.

Powered by [react-native-css](https://github.com/sabeurthabti/react-native-css) and [less.js](http://lesscss.org/).

### Example

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
import { rnLess } from 'rn-less/src/runtime';// import the decorator
import style from './a.less.js'; // import the style

const rootStyle = style({containerMargin,bgColor});// pass your arguments and get the style object

//decorate the component with the style
//write the decorator in this a.b way to let the vscode extention track the style
@rnLess(rootStyle.CardExampleStyle)
class CardExample extends Component {
    //the strings in the style attribute are the class names in the less file
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

## How to use it

#### Install things
```bash
# enter the root directory of the project
npm i -S rn-less
cp -i node_modules/rn-less/example/gulpfile.js .
npm i -g gulp

```
#### Modify the gulpfile.js
```javascript
// change it to your source folder
const sourceDir='./app';
```
#### Notice

All the styles in a component with the same className would be combined into a single one. It ignores the hierarchy of the less file. The hierarchy in the less file is just for you, not for rn-less.


#### Run the gulp
```bash
gulp
```
#### Create your less file and import it in a js/jsx file

```javascript
import { rnLess } from 'rn-less/src/runtime';// import the decorator
import style from './a.less.js'; // import the style

const rootStyle = style({containerMargin,bgColor});// pass your arguments and get the style object

//decorate the component with the style
@rnLess(rootStyle.CardExampleStyle)
class CardExample extends Component {}
```

## What's more

#### Process the less output

```javascript
code = processStyleobject({
    code,
    hierarchy: false,
    custom: function ({
        root,
        traverseProperty,
        traverseStyle,
        traverseChunk
    }) {
        // font-size:10 -> fontSize:Theme.font10
        traverseProperty(root, function ({ value, property, selector }) {
            if (property === 'fontSize') {
                return `Theme.font${value}`;
            }
        });

        // sort the keys 
        traverseStyle(root, function ({ style, selector, chunk, component }) {
            const ret = {};
            Object.keys(style).sort().forEach((key) => {
                ret[key] = style[key];
            });
            return ret;
        });

        //print the chunks
        traverseChunk(root, function ({ chunk, styleName, component }) {
            console.log(chunk);
        });
    }
});
```

#### Enjoy the vscode extension

[https://github.com/blackmiaool/rn-less-helper](https://github.com/blackmiaool/rn-less-helper)
<p align="center">      
    <img width="600" src="https://raw.githubusercontent.com/blackmiaool/rn-less-helper/master/function.gif">  
</p>
