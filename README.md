# Social Network

A dynamic social networking web application built with Python (Django), JavaScript, HTML, and CSS. This platform enables users to create posts, follow other users, and engage with content through likes and comments.

## Features

### User Interactions
- **New Post Creation**: Users can create text-based posts
- **Post Editing**: Users can edit their own posts using async JavaScript
- **Like System**: Interactive like/unlike functionality for posts
- **Follow System**: Users can follow/unfollow other users
- **Pagination**: Display 10 posts per page with Next/Previous navigation

### Views
1. **All Posts**
   - Displays posts from all users
   - Reverse chronological order
   - Shows username, content, timestamp, and like count

2. **Profile Page**
   - Displays user's followers count, following count and total post number
   - Shows all posts by the user
   - Follow/Unfollow button for other users
   - Cannot follow self

3. **Following Feed**
   - Shows posts only from followed users
   - Available only to authenticated users

### Technical Details

#### Frontend
- **JavaScript**: Asynchronous post editing and like functionality
- **HTML**: Semantic markup for content structure
- **CSS**: Responsive design and styling

#### Backend
- **Python/Django**: Server-side logic and data management
- **Authentication**: User registration and login system
- **Database**: Post storage and relationship management

## Installation

1. Clone the repository
```bash
git clone https://github.com/KaungMinSett/social-network.git
cd social-network
pip install -r requirements.txt 
```


2. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```
3. Start development server

```bash
python manage.py runserver
```