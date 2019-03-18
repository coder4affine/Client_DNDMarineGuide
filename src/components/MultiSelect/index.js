import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class index extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    searchKey: PropTypes.string.isRequired,
    uniqueKey: PropTypes.any.isRequired,
  };

  state = {
    data: [],
    search: '',
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
    });
  }

  _selectItem = item => {
    const { data } = this.state;
    const { uniqueKey } = this.props;

    const i = data.findIndex(x => x[uniqueKey] === item[uniqueKey]);

    this.setState({
      data: [
        ...data.slice(0, i),
        { ...data[i], selected: !data[i].selected },
        ...data.slice(i + 1),
      ],
    });
  };

  _renderItem = ({ item }) => {
    const { uniqueKey } = this.props;
    return (
      <RectButton key={`${item[uniqueKey]}`} onPress={() => this._selectItem(item)}>
        <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
          <Icon
            name={item.selected ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            color="#000"
          />
          <View style={{ flex: 1 }}>{this.props.renderItem(item)}</View>
        </View>
      </RectButton>
    );
  };

  _keyExtractor = item => {
    const { uniqueKey } = this.props;
    return `${item[uniqueKey]}`;
  };

  _renderHeader = () => {
    const { search } = this.state;
    return (
      <View style={{ padding: 10 }}>
        <Icon
          style={{
            position: 'absolute',
            top: 10 + (30 - 18) / 2,
            left: 15,
            height: 18,
            width: 18,
          }}
          name="search"
          size={18}
          color="#4A4A4A"
        />
        <TextInput
          ref={ref => {
            this.searchInput = ref;
          }}
          autoComplete="off"
          placeholder="Type Here..."
          underlineColorAndroid="transparent"
          style={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: '#4A4A4A',
            height: 30,
            borderRadius: 4,
            paddingLeft: 30,
            paddingRight: 30,
          }}
          returnKeyType="done"
          onChangeText={text => {
            this.setState({ search: text });
          }}
        />
        {!!search && (
          <BorderlessButton
            style={{
              position: 'absolute',
              top: 10 + (30 - 18) / 2,
              right: 15,
              height: 18,
              width: 18,
            }}
            onPress={() => {
              this.setState({ search: '' }, () => {
                this.searchInput.clear();
              });
            }}
          >
            <Icon name="close" size={18} color="#4A4A4A" />
          </BorderlessButton>
        )}
      </View>
    );
  };

  render() {
    const { data, search } = this.state;
    const { searchKey } = this.props;

    const filteredCities = data.filter(x => x[searchKey].includes(search));
    return (
      <FlatList
        data={filteredCities}
        extraData={search}
        ListHeaderComponent={this._renderHeader}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    );
  }
}