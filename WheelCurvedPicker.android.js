'use strict';

import React from 'react';
import PropTypes from 'prop-types'
import {
	View,
	ColorPropType,
	requireNativeComponent,
} from 'react-native';

const WheelCurvedPickerNativeInterface = {
	name: 'WheelCurvedPicker',
	propTypes: {
		...View.propTypes,
		data:PropTypes.array,
		textColor: ColorPropType,
		textSize: PropTypes.number,
		itemStyle: PropTypes.object,
		itemSpace: PropTypes.number,
		onValueChange: PropTypes.func,
		selectedValue: PropTypes.any,
		selectedIndex: PropTypes.number,
	}
}

const WheelCurvedPickerNative = requireNativeComponent('WheelCurvedPicker', WheelCurvedPickerNativeInterface);

class WheelCurvedPicker extends React.Component {

	constructor(props){
		super(props)
		this.state = this._stateFromProps(props)
		this.viewRef = React.createRef()
	}

	static defaultProps = {
		itemStyle : {color:"white", fontSize:26},
		itemSpace: 20
	}

	componentDidMount() {
		this.viewRef.current.addEventListener('keydown', this.handleKeyDown);
		this.viewRef.current.setAttribute('tabIndex', '0');
	}
	
	componentWillUnmount() {
		this.viewRef.current.removeEventListener('keydown', this.handleKeyDown);
	}
	
	componentWillReceiveProps (props) {
		this.setState(this._stateFromProps(props));
	}

	_stateFromProps (props) {
		var selectedIndex = 0;
		var items = [];
		React.Children.forEach(props.children, function (child, index) {
			if (child.props.value === props.selectedValue) {
				selectedIndex = index;
			}
			items.push({value: child.props.value, label: child.props.label});
		});

		var textSize = props.itemStyle.fontSize
		var textColor = props.itemStyle.color

		return {selectedIndex, items, textSize, textColor};
	}

	_onValueChange = (e) => {
		if (this.props.onValueChange) {
			this.props.onValueChange(e.nativeEvent.data);
		}
	}
	
	handleKeyDown = (event) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
			let index = this.state.selectedIndex;
			if (event.key === 'ArrowUp' && index > 0) {
				index--;
			} else if (event.key === 'ArrowDown' && index < this.state.items.length - 1) {
				index++;
			}
			this.setState({ selectedIndex: index });
		} else if (event.key === 'Enter') {
			event.preventDefault();
			let selectedValue = this.state.items[this.state.selectedIndex].value;
			if (this.props.onValueChange) {
				this.props.onValueChange(selectedValue);
			}
		}
	}

	render() {
		return (
			<View
				ref={this.viewRef}
				accessible={true}
				accessibilityRole='spinbutton'
				accessibilityLabel={this.props.accessibilityLabel}
				accessibilityValue={this.state.items[this.state.selectedIndex].label}
				style={this.props.style}>
				<WheelCurvedPickerNative
					{...this.props}
					onValueChange={this._onValueChange}
					data={this.state.items}
					textColor={this.state.textColor}
					textSize={this.state.textSize}
					selectedIndex={parseInt(this.state.selectedIndex)} />
			</View>
		);
	}
}

class Item extends React.Component {

	render () {
		// These items don't get rendered directly.
		return null;
	}
}

WheelCurvedPicker.Item = Item;

module.exports = WheelCurvedPicker;
