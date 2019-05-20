import React, {Component} from 'react';
import './App.css';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';

import MyListItem from './MyListItem';

class MyComponent extends Component{
	
	constructor(props)
	{
		super(props)
		this.chSet = new Set()

		this.state = {books: [], page: 1, number_of_books: 0, number_of_pages: 0, search_text: ''}
	}
	
	setPage(curr_page, YOUR_SEARCH_FIELD_CONTENTS)
	{
		let data = {page: curr_page}
		if(YOUR_SEARCH_FIELD_CONTENTS)
			data = {page: curr_page, filters:[{type: "all", values: [YOUR_SEARCH_FIELD_CONTENTS]}]}
		
		fetch('http://nyx.vima.ekt.gr:3000/api/books', {
		  method: 'POST',
		  body: JSON.stringify(data),
		  headers:{'Content-Type': 'application/json'}
		}).then(res => res.json())
		.then(response =>
		{
			//console.log('Success:', JSON.stringify(response))
			const flot = Number(response.count) / 20.0
			let number_of_pages = Number(flot.toFixed(0)) // convert to an integer
			if(number_of_pages<flot)
				number_of_pages += 1 // deals with fraction of last page
			if(curr_page>number_of_pages)
				curr_page = number_of_pages
			this.setState({books: response.books, number_of_books: response.count, number_of_pages: number_of_pages, page: curr_page})
		})
 		.catch(error => console.error('Error:', error));
		this.setState({page: curr_page, search_text: YOUR_SEARCH_FIELD_CONTENTS})
	}

	componentWillMount()
	{
		this.setPage(this.state.page, this.state.search_text)
	}
	
	
	page(first_last)
	{
		if(first_last==='first')
			this.setPage(1, this.state.search_text)
		else
			this.setPage(this.state.number_of_pages, this.state.search_text)
	}

	pagePrev()
	{
		this.setPage((this.state.page - 1), this.state.search_text) // button is diabled if at last page value
	}

	pageNext()
	{
		this.setPage((this.state.page + 1), this.state.search_text) // button is diabled if at last page value
	}

	typeNumber(a)
	{
		let ns = Number(a.target.value)
		if(ns>this.state.number_of_pages)
			ns = this.state.number_of_pages
		this.setPage(ns, this.state.search_text)
	}

	typeText(a)
	{
		let page = this.state.page
		if(page===0)
			page=1
		this.setPage(page, a.target.value)
	}

	reset()
	{
		this.setPage(1, '') // set to page 1, no search text
	}

	ch(ch)
	{
		this.setPage(this.state.page, this.state.search_text + ch)
	}
	
	getCharArray(books)
	{
		if(!books)return []
		const convert_to_strings = (set, book) =>
		{
			const s = Array.from(''+book.book_author+book.book_title+book.book_publication_city+book.book_publication_country)
			s.map(ch=>set.add(ch))
			return set
		}
		books.reduce(convert_to_strings, this.chSet)
		return [...this.chSet].sort()
	}
	
	render()
	{
		const books 				= this.state.books
		const number_of_books 		= this.state.number_of_books
		const number_of_pages 		= this.state.number_of_pages
		const current_page 			= this.state.page
		const disabled_prev 		= this.state.page<=1 ? true : false
		const disabled_next 		= this.state.page>=this.state.number_of_pages ? true : false
		const last_page				= this.state.number_of_pages
		const search_text			= this.state.search_text
		const book_num_page_base 	= ((current_page-1) * 20) + 1
		const chars					= this.getCharArray(books)
		
		return (
		<>
		{number_of_pages===0 ? <div className='infoClass'>NO BOOKS FOUND. <Button variant="danger" onClick={()=>this.reset()}>RESET</Button></div> : null}
			<div className='infoClass'>There are {number_of_books} books.</div>
			<div className='infoClass'>There are {number_of_pages} pages.</div>
			<div className='infoClass'>
				<div className='buttonDivClass'><Button variant="primary" onClick={()=>this.page('first')}>First Page</Button></div>
				<div className='buttonDivClass'><Button variant="primary" onClick={()=>this.pagePrev()}  disabled={disabled_prev}>{`<< Previous Page`}</Button></div>
				
				<div className='buttonDivClass'>
					<input type='number' min='1' max={last_page} onChange={(a)=>this.typeNumber(a)} value={current_page} />
				</div>
				
				<div className='buttonDivClass'><Button variant="primary" onClick={()=>this.pageNext()}  disabled={disabled_next}>{`Next Page >>`}</Button></div>
				<div className='buttonDivClass'><Button variant="primary" onClick={()=>this.page('last')}>Last Page</Button></div>
			</div>
			<div className='infoClass'>FILTER: <input type='text' onChange={(a)=>this.typeText(a)} value={search_text} /></div>
			<div className='infoClass'>CHARS (from viewed pages):{chars.map(ch=><Button variant="secondary" onClick={()=>this.ch(ch)}>{ch}</Button>)}</div>
			<div className='listDisplayClass'>
			{
				books && books.map((book, i)=><MyListItem key={''+i} book_num={book_num_page_base + i} book={book} />)
			}
			</div>
		</>
		)
	}
}

export default MyComponent