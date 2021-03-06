/* eslint-disable camelcase */
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { formatPhoneNumber, openLink, action } from 'utils';
import { connect } from 'react-redux';
import { FETCH_ADVERTISEMENT, REQUEST, CLEAR_ADVERTISEMENT } from '../../constants/actionTypes';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class index extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    advertisement: PropTypes.object.isRequired,
    getAdvertisement: PropTypes.func.isRequired,
    clearAdvertisement: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params },
      },
      clearAdvertisement,
      getAdvertisement,
    } = props;
    const { businessDetails } = params;

    clearAdvertisement();
    if (businessDetails.advertiser === 'N') {
      getAdvertisement(1);
    }
  }

  renderWithAdvertisement = (businessDetails, distance) => {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, padding: 10 }}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {businessDetails.bus_name}
        </Text>
        {businessDetails.bus_longitude && businessDetails.bus_latitude && (
          <MapView
            ref={map => {
              this.map = map;
            }}
            style={{
              height: 200,
              marginHorizontal: 10,
              flexDirection: 'row',
            }}
            initialRegion={{
              latitude: businessDetails.bus_latitude,
              longitude: businessDetails.bus_longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            provider={PROVIDER_GOOGLE}
            scrollEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: businessDetails.bus_latitude,
                longitude: businessDetails.bus_longitude,
              }}
            />
          </MapView>
        )}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 3, padding: 10 }}>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {`${businessDetails.bus_address || ''} ${businessDetails.bus_address2 ||
                ''} ${businessDetails.bus_city || ''} ${businessDetails.stateName ||
                ''} ${businessDetails.bus_zip || ''} ${businessDetails.countryName || ''}`}
            </Text>
            <RectButton
              style={{ flexDirection: 'row' }}
              onPress={() => openLink(`tel:${businessDetails.bus_phone}`)}
            >
              <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                <Icon name="phone" size={24} color="#000" />
                <Text
                  style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, paddingHorizontal: 10 }}
                  numberOfLines={1}
                  allowFontScaling={false}
                >
                  {formatPhoneNumber(businessDetails.bus_phone)}
                </Text>
              </View>
            </RectButton>
            {!!distance && (
              <Text style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {`Current Distance: ${distance || 'Not Found'}`}
              </Text>
            )}
          </View>
        </View>
        {businessDetails.bus_website && (
          <RectButton
            style={{ flexDirection: 'row' }}
            onPress={() => openLink(businessDetails.bus_website)}
          >
            <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
              <Icon name="explore" size={24} color="#000" />
              <Text
                style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, paddingHorizontal: 10 }}
                numberOfLines={1}
                allowFontScaling={false}
              >
                {businessDetails.bus_website}
              </Text>
            </View>
          </RectButton>
        )}
      </View>
    );
  };

  renderWithoutAdvertisement = businessDetails => {
    const { advertisement } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, padding: 10 }}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {businessDetails.bus_name}
        </Text>
        <RectButton
          style={{ flexDirection: 'row' }}
          onPress={() => openLink(`tel:${businessDetails.bus_phone}`)}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
            <Icon name="phone" size={24} color="#000" />
            <Text
              style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, paddingHorizontal: 10 }}
              numberOfLines={1}
              allowFontScaling={false}
            >
              {formatPhoneNumber(businessDetails.bus_phone)}
            </Text>
          </View>
        </RectButton>
        <View
          style={{
            flexDirection: 'row',
            height: StyleSheet.hairlineWidth,
            backgroundColor: '#4a4a4a',
          }}
        />
        {advertisement && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              onLoad={this.redirect}
              source={{ uri: advertisement.ad_url }}
              resizeMode="contain"
              style={{ height: 250, width: 250 }}
            />
          </View>
        )}
      </View>
    );
  };

  render() {
    const {
      navigation: {
        state: { params },
      },
    } = this.props;

    const { businessDetails, distance } = params;

    if (businessDetails.advertiser === 'N') {
      return <Fragment>{this.renderWithoutAdvertisement(businessDetails)}</Fragment>;
    }
    return <Fragment>{this.renderWithAdvertisement(businessDetails, distance)}</Fragment>;
  }
}

function mapStateToProps(state) {
  return {
    advertisement: state.advertisement,
    error: !!state.error.FETCH_ADVERTISEMENT,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAdvertisement: search => dispatch(action(`${FETCH_ADVERTISEMENT}_${REQUEST}`, search)),
    clearAdvertisement: () => dispatch(action(CLEAR_ADVERTISEMENT)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(index);
