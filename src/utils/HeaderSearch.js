import React,{Component} from 'react'
import {TextInput, View} from 'react-native'
import {Icon} from "@ant-design/react-native";

export default class HeaderSearch extends Component{


    render () {
        return (
            <View style={{height: 40, flexDirection: 'row', backgroundColor: '#FFFFFF', alignItems: 'center'}}>
                <Icon
                    style={{margin: 10, color: '#36B7AB'}}
                    name='arrow-left'
                    onPress={() => this.props.navigation.goBack()}
                />
                <TextInput
                    onSubmitEditing={(event) => this.props.SubmitSearch(event.nativeEvent.text)}
                    inlineImagePadding={20}
                    style={{width: '85%', backgroundColor: '#F5F5F5', height: 30, paddingVertical: 0}}
                    inlineImageLeft='search_icon'
                    placeholder='请输入关键字'
                    onChangeText={(text) =>
                       this.props.ChangeText(text)
                    }
                />
            </View>
        )
    }
}

