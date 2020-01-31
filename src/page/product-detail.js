import React,{Component} from 'react'
import {View,Text} from 'react-native'

export default class ProductDetail extends Component{
    render () {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Details Screen</Text>
                <Text>{this.props.navigation.getParam('ProductId')}</Text>
            </View>
        )
    }
}
