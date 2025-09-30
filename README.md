# Book Notes Tracker

A web application to track books you've read, take notes, and rate them. Inspired by Derek Sivers' book notes website.

## Features 

- Add books with title, author, rating, date read, and notes
- View all books with sorting options (by date, rating, or title)
- Edit or delete book entries
- Automatic book cover retrieval from Open Library API 
- Clean, responsive design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher) 
- PostgreSQL

### Installation

1. Clone or download this project 
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Set up the database:
   - Create a PostgreSQL database named `book_tracker`
   - Run the SQL commands from `database.sql` to create the table
5. Create a `.env` file with your database credentials (use `.env.example` as a template)
6. Start the server: `npm run dev` (for development) or `npm start` (for production)

### Usage

1. Open your browser and go to `http://localhost:3000`
2. Click "Add New Book" to add your first book
3. View your books on the homepage, where you can sort them by different criteria
4. Click on any book to view details and notes
5. Edit or delete books from the detail view

## API Integration

This application uses the Open Library Covers API to fetch book covers automatically based on book titles.

## Technologies Used

- Backend: Node.js, Express.js
- Database: PostgreSQL
- Templating: EJS
- HTTP Client: Axios
- Frontend: HTML5, CSS3, JavaScript
