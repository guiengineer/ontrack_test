import React, {Component} from 'react';
import './App.css';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';


class MySection extends Component{
	
	render()
	{
		const {label,txt} = this.props
		return (
					<div className='listItemSectionClass'>
						<div className='listItemSectionLabelClass'>{label}</div>
						<div className='listItemSectionTxtClass'>{txt}</div>
					</div>
		)
	}
}

export default MySection