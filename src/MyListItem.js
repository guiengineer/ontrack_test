import React, {Component} from 'react';
import './App.css';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';

import MySection from './MySection'


class MyListItem extends Component{
	
	render()
	{
		const {	id,
				book_publication_year,
				book_author,
				book_title,
				book_pages,
				book_publication_city,
				book_publication_country} = this.props.book
		const {	book_num, }  = this.props
				
		return (
				<div className='listItemClass'>
					<MySection label='Book#:' 		txt={book_num} 			/>
					<MySection label='ID:' 			txt={id} 			/>
					<MySection label='Pub Year:' 	txt={book_publication_year} 	/>
					<MySection label='Author:' 		txt={book_author} 	/>
					<MySection label='Title:' 		txt={book_title} 	/>
					<MySection label='#Pages:' 		txt={book_pages} 	/>
					<MySection label='Pub City:' 	txt={book_publication_city} 	/>
					<MySection label='Pub Country:' txt={book_publication_country} 	/>
				</div>
		)
	}
}

export default MyListItem