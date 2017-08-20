// a.less
container{
    flex - direction: row;
    background - color:red;
}
// b.rn
require("./a.less");
class A {
    render() {
        <B key="container" />
    }
}
//output 
class A {
    render() {
        <B key="container" style={A.styles.container} />
    }
    static styles = {
        container: {
            flexDirection: 'row',
            backgroundColor: 'red'
        }
    }
}





class Navbar extends Component {
    static propTypes = {
        list: PropTypes.array.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        backgroundColorActive: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        colorActive: PropTypes.string.isRequired,
        navWidth: PropTypes.number.isRequired,
        selectingIndex: PropTypes.number.isRequired,
        pageWidth: PropTypes.number.isRequired,
        onSelectTab: PropTypes.func.isRequired,
    }
    componentWillMount() {
        const index = this.props.selectingIndex;
        this.setState({
            index
        });
    }
    componentDidMount() {
        setTimeout(() => {
            this.update(this.props);
        });
    }
    update(props) {
        const index = props.selectingIndex;
        this.setState({
            index
        });
        const navWidth = this.props.navWidth;
        let x = (index + 0.5) * navWidth - this.props.pageWidth / 2;
        if (x <= 0) {
            x = 0;
        } else if (x > navWidth * this.props.list.length - this.props.pageWidth) {
            x = navWidth * this.props.list.length - this.props.pageWidth;
        }
        this.scroll.scrollTo({ x });
    }
    componentWillReceiveProps(props) {
        this.update(props);
    }
    onPress(index) {
        this.props.onSelectTab(index);
    }
    render() {
        return (<View style={{ backgroundColor: 'white' }}>
            <ScrollView style={{ height: 60 }} horizontal showsHorizontalScrollIndicator={false} ref={scroll => this.scroll = scroll}>
                {this.props.list.map((arr, i) => {
                    const isActive = i == this.state.index;
                    return (<TouchableWithoutFeedback onPress={this.onPress.bind(this, i)} key={i}>
                        <View
                        key="container1" >
                            <View
                                key="container2"
                                style={{ backgroundColor: isActive ? this.props.backgroundColorActive : this.props.backgroundColor, width: this.props.navWidth }}
                            >
                                {arr.map((text, j) => <View key={`${i}-${j}`}>
                                    <Text style={{ textAlign: 'center', color: isActive ? this.props.colorActive : this.props.color }}>{text}</Text>
                                </View>)}
                            </View>
                        {isActive && <View key="triangle" style={{ borderTopColor: this.props.backgroundColorActive }} />}
                        </View>
                    </TouchableWithoutFeedback>);
                })}
            </ScrollView>
        </View>);
    }
}

