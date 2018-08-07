import React, { Component } from 'react';
import { TextInput, Image, StyleSheet, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { allCountries, iso2Lookup, allCountryCodes } from 'country-telephone-data';

import { dynamicSize } from '../utils/DynamicSize';
import { Flag } from './Flag';

const some = require('lodash/some');
const find = require('lodash/find');
const reduce = require('lodash/reduce');
const findIndex = require('lodash/findIndex');
const first = require('lodash/first');
const tail = require('lodash/tail');
const trim = require('lodash/trim');
const startsWith = require('lodash/startsWith');


const rightIcon = require('../assets/images/icon/iconRightGray.png');

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: '#000000',
    borderWidth: dynamicSize(1),
    width: dynamicSize(335),
    height: dynamicSize(58),
    paddingLeft: dynamicSize(22),
    marginBottom: dynamicSize(-1),
    marginTop: dynamicSize(-1),
    flexDirection: 'row',
  },
  input: {
    fontSize: dynamicSize(15),
    fontFamily: 'BentonSans-Book',
    backgroundColor: '#000000',
    color: '#EBEBEB',
    borderWidth: dynamicSize(1),
    width: dynamicSize(240),
    height: dynamicSize(56),
  },
  input1: {
    borderTopLeftRadius: dynamicSize(4),
    borderTopRightRadius: dynamicSize(4),
  },
  input2: {
    borderTopLeftRadius: dynamicSize(0),
    borderTopRightRadius: dynamicSize(0),
    borderBottomLeftRadius: dynamicSize(0),
    borderBottomRightRadius: dynamicSize(0),
  },
  input3: {
    borderBottomLeftRadius: dynamicSize(4),
    borderBottomRightRadius: dynamicSize(4),
  },
  input4: {
    borderRadius: dynamicSize(4),
  },
  inputInActive: {
    borderColor: '#1D1D1D',
    zIndex: 0,
  },
  inputActive: {
    borderColor: '#A5977C',
    zIndex: 1,
  },
});

export function formatNumber(text, pattern, autoFormat) {
  const phoneNumber = text.replace(/[\+\-]+/g, '');
  if (!phoneNumber || phoneNumber.length === 0) {
    return '+';
  }
  if ((phoneNumber && phoneNumber.length < 2) || !pattern || !autoFormat) {
    return `+${phoneNumber}`;
  }

  const formattedObject = reduce(
    pattern,
    (acc, character) => {
      console.log();
      if (acc.remainingText.length === 0) {
        return acc;
      }
      if (character !== '.') {
        return {
          formattedText: acc.formattedText + character,
          remainingText: acc.remainingText,
        };
      }
      return {
        formattedText: acc.formattedText + first(acc.remainingText),
        remainingText: tail(acc.remainingText),
      };
    },
    { formattedText: '', remainingText: phoneNumber.split('') },
  );
  return (
    formattedObject.formattedText + formattedObject.remainingText.join('')
  );
}

export function isNumberValid(inputNumber) {
  const countries = allCountries;
  return some(countries, (country) => {
    return (
      startsWith(inputNumber, country.dialCode) ||
      startsWith(country.dialCode, inputNumber)
    );
  });
}
export function replaceCountryCode(currentSelectedCountry, nextSelectedCountry, number) {
  // const dialCodeRegex = RegExp(`^()`);
  const newNumber = number.replace(`${currentSelectedCountry.dialCode}`, `${nextSelectedCountry.dialCode}`);
  if (newNumber === number) {
    return nextSelectedCountry.dialCode + number;
  }
  return newNumber;
}

export class PhoneInput extends Component {
  static propTypes = {
    pos: PropTypes.number.isRequired,
    autoFormat: PropTypes.bool,
    defaultCountry: PropTypes.string,
    isValid: PropTypes.func,
    onlyCountries: PropTypes.arrayOf(PropTypes.object),
    preferredCountries: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    inputProps: PropTypes.object,
    flagsImagePath: PropTypes.string,
    onClickFlags: PropTypes.func,
  };
  static defaultProps = {
    autoFormat: true,
    onlyCountries: allCountries,
    defaultCountry: allCountries[0].iso2,
    isValid: isNumberValid,
    flagsImagePath: 'flags.png',
    preferredCountries: [],
    disabled: false,
    required: false,
    inputProps: {},
    onClickFlags: () => {},
  };
  constructor(props) {
    super(props);
    console.log(props.value);
    const preferredCountries = this.props.preferredCountries
      .map((iso2) => {
        if (iso2Lookup.iso2) {
          return allCountries[iso2Lookup[iso2]];
        }
        return null;
      })
      .filter(val => val !== null);
    this.state = {
      selected: false,
      preferredCountries,
      queryString: '',
      freezeSelection: false,
      ...this._mapPropsToState(this.props, true),
    };
    console.log(this.state);
    this.scroll = null;
    if (props.onChange) {
      props.onChange(
        this.state.formattedNumber,
        this.state.selectedCountry,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this._mapPropsToState(nextProps, true),
    });
  }

  getFlagStyle() {
    return {
      width: 16,
      height: 11,
      backgroundImage: `url(${this.props.flagsImagePath})`,
    };
  }

  guessSelectedCountry(inputNumber) {
    const inputNumberForCountries = inputNumber.substr(0, 4);
    let bestGuess;
    if (trim(inputNumber) !== '') {
      bestGuess = reduce(
        this.props.onlyCountries,
        (selectedCountry, country) => {
          if (allCountryCodes[inputNumberForCountries] &&
            allCountryCodes[inputNumberForCountries][0] === country.iso2
          ) {
            return country;
          } else if (
            allCountryCodes[inputNumberForCountries] &&
                    allCountryCodes[inputNumberForCountries][0] ===
                        selectedCountry.iso2
          ) {
            return selectedCountry;
          }
          if (startsWith(inputNumber, country.dialCode)) {
            if (
              country.dialCode.length >
                            selectedCountry.dialCode.length
            ) {
              return country;
            }
            if (
              country.dialCode.length ===
                                selectedCountry.dialCode.length &&
                            country.priority < selectedCountry.priority
            ) {
              return country;
            }
          }

          return selectedCountry;
        },
        { dialCode: '', priority: 10001 },
        this,
      );
    }

    if (!bestGuess || !bestGuess.name) {
      bestGuess = find(allCountries, { iso2: this.props.defaultCountry }) ||
      this.props.onlyCountries[0];
    }

    return bestGuess;
  }

  handleInputFocus() {
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus(
        this.state.formattedNumber,
        this.state.selectedCountry,
      );
      this._fillDialCode();
    }
    this.setState({ selected: true });
  }
  _mapPropsToState(props) {
    let inputNumber;
    if (props.value) {
      inputNumber = props.value;
    } else if (props.initialValue) {
      inputNumber = props.initialValue;
    } else if (this.props.value) {
      // just cleared the value
      inputNumber = '';
    } else if (
      this.state &&
        this.state.formattedNumber &&
        this.state.formattedNumber.length > 0
    ) {
      inputNumber = this.state.formattedNumber;
    } else {
      inputNumber = '';
    }
    const selectedCountryGuess = this.guessSelectedCountry(
      inputNumber.replace(/\D/g, ''),
    );
    const selectedCountryGuessIndex = findIndex(
      allCountries,
      selectedCountryGuess,
    );
    const formattedNumber = formatNumber(
      inputNumber.replace(/\D/g, ''),
      selectedCountryGuess ? selectedCountryGuess.format : null,
      this.props.autoFormat,
    );
    return {
      selectedCountry: selectedCountryGuess,
      highlightCountryIndex: selectedCountryGuessIndex,
      formattedNumber,
    };
  }
  _fillDialCode() {
    if (this.state.formattedNumber === '+') {
      this.setState({
        formattedNumber: `+${this.state.selectedCountry.dialCode}`,
      });
    }
  }

  handleInput(text) {
    let formattedNumber = '+';
    let newSelectedCountry = this.state.selectedCountry;
    let { freezeSelection } = this.state;

    if (text === this.state.formattedNumber) {
      return;
    }

    if (text.length > 0) {
      const inputNumber = text.replace(/\D/g, '');
      if (
        !this.state.freezeSelection ||
            this.state.selectedCountry.dialCode.length > inputNumber.length
      ) {
        newSelectedCountry = this.guessSelectedCountry(
          inputNumber.substring(0, 6),
        );
        freezeSelection = false;
      }
      formattedNumber = formatNumber(
        inputNumber,
        newSelectedCountry.format,
        this.props.autoFormat,
      );
    }

    this.setState(
      {
        formattedNumber,
        freezeSelection,
        selectedCountry:
                newSelectedCountry.dialCode.length > 0
                  ? newSelectedCountry
                  : this.state.selectedCountry,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(
            formatNumber(
              this.state.formattedNumber,
              this.state.selectedCountry.format,
              this.props.autoFormat,
            ),
            this.state.selectedCountry,
          );
        }
      },
    );
  }
  handleInputBlur() {
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(
        this.state.formattedNumber,
        this.state.selectedCountry,
      );
    }
    this.setState({ selected: false });
  }
  scrollToInput(reactNode) {
    this.scroll.scrollToFocusedInput(reactNode);
  }
  render() {
    const inputs = [styles.input1, styles.input2, styles.input3, styles.input4];
    const otherProps = this.props.inputProps;
    if (this.props.inputId) {
      otherProps.id = this.props.inputId;
    }
    const { selectedCountry } = this.props;
    return (
      <View
        style={[
          styles.inputView,
          inputs[this.props.pos],
          (this.state.selected ? styles.inputActive : styles.inputInActive)]} >
        <View style={{ height: 60, justifyContent: 'center' }}>
          <TouchableHighlight onPress={() => { this.props.onClickFlags(this.state); }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 8 }}>
              {selectedCountry && selectedCountry.iso2 ? <Flag code={selectedCountry.iso2} /> : ''}
              <Image source={rightIcon} style={{ marginLeft: 8 }} />
            </View>
          </TouchableHighlight>
        </View>
        <TextInput
          onChangeText={this.handleInput.bind(this)}
          onFocus={this.handleInputFocus.bind(this)}
          onBlur={this.handleInputBlur.bind(this)}
          value={this.props.value || this.state.formattedNumber}
          type="tel"
          style={styles.input}
          pattern={this.props.pattern}
          required={this.props.required}
          disabled={this.props.disabled}
          {...otherProps} />
      </View>
    );
  }
}
