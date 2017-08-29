// originally from https://github.com/jacklam718/react-native-card-view
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';

import Button from 'react-native-button';

import {
    Card,
    CardTitle,
    CardImage,
    CardContent,
    CardAction
} from 'react-native-card-view';
import { rnLess } from 'rn-less/runtime';
import style from './a.less.js';

const rootStyle = style({});

@rnLess(rootStyle.CardExampleStyle)
class CardExample extends Component {

    _renderTitle(title) {
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
                        <CardContent>
                            <Text>Content</Text>
                        </CardContent>
                        <CardAction >
                            <Button
                                style="button"
                                onPress={() => { }}>
                                Button 1
              </Button>
                            <Button
                                style="button"
                                onPress={() => { }}>
                                Button 2
              </Button>
                        </CardAction>
                    </Card>

                    {this._renderTitle('Fix Width = 300')}
                    <Card styles={{ card: { width: 300 } }}>
                        <CardTitle>
                            <Text style="title">Card Title</Text>
                        </CardTitle>
                        <CardContent>
                            <Text>Content</Text>
                        </CardContent>
                        <CardAction >
                            <Button
                                style="button"
                                onPress={() => { }}>
                                Button 1
              </Button>
                            <Button
                                style="button"
                                onPress={() => { }}>
                                Button 2
              </Button>
                        </CardAction>
                    </Card>

                    {this._renderTitle('Card Image + Card Title + Card Content + Card Action')}
                    <Card>
                        <CardImage>
                            <Image
                                style="card-image"
                                source={{ uri: 'https://getmdl.io/assets/demos/image_card.jpg' }}
                            />
                        </CardImage>
                        <CardTitle>
                            <Text style="title">Card Title</Text>
                        </CardTitle>
                        <CardContent>
                            <Text>Content</Text>
                            <Text>Content</Text>
                            <Text>Content</Text>
                            <Text>Content</Text>
                            <Text>Content</Text>
                            <Text>Content</Text>
                        </CardContent>
                        <CardAction separator>
                            <Button
                                style="button"
                                onPress={() => { }}>
                                Button 1
              </Button>
                            <Button
                                style="button"
                                styleDisabled={{ color: 'red' }}
                                onPress={() => { }}>
                                Button 2
              </Button>
                        </CardAction>
                    </Card>

                    {this._renderTitle('Card Image')}
                    <Card>
                        <CardImage>
                            <Image
                                style="card-image2"
                                source={{ uri: 'https://getmdl.io/assets/demos/image_card.jpg' }}
                            >
                                <Text style={["title", { alignSelf: 'center' }]}>Beautiful Girl</Text>
                            </Image>
                        </CardImage>
                    </Card>

                    {this._renderTitle('Card Image')}
                    <Card>
                        <CardImage>
                            <Image
                                style="card-image2"
                                source={{ uri: 'https://static.pexels.com/photos/59523/pexels-photo-59523.jpeg' }}
                            />
                        </CardImage>
                    </Card>
                </View>
            </ScrollView>
        );
    }
}
export default CardExample;