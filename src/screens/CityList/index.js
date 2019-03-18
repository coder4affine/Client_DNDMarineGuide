import { connect } from 'react-redux';
import { action } from 'utils';
import cityList from './cityList';
import { FETCH_CITIES, REQUEST } from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    cities: state.cities,
    loading: !!state.loading.FETCH_CITIES,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCities: () => dispatch(action(`${FETCH_CITIES}_${REQUEST}`)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(cityList);